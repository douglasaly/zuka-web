import { uuidv7 } from 'uuidv7'
import {
	apiError,
	apiSuccess,
	ErrorCode,
	withErrorHandling,
} from '@/lib/api-response'
import { requireAuth } from '@/lib/auth'
import { ensureSellerProfile, getUserRoles } from '@/lib/auth/roles'
import { mapStoreRow } from '@/lib/mappers/marketplace'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { CreateStoreSchema, StoreFiltersSchema } from '@/lib/validations'
import { Slug } from '@/utils/slug'

// ─── GET /api/stores ────────────────────────────────────
// Lista lojas públicas. fix N+1 com subqueries inline.

export const GET = withErrorHandling(async (request) => {
	const { searchParams } = new URL(request.url)
	const params = StoreFiltersSchema.parse({
		search: searchParams.get('search') ?? undefined,
		status: searchParams.get('status') ?? undefined,
	})

	const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
	const offset = Math.min(Number(searchParams.get('offset') ?? 0), 1000)

	const supabase = createSupabaseAdmin()

	let query = supabase
		.from('stores')
		.select(
			`
			id, name, slug, description, state, status,
			logo_url, banner_url, phone, whatsapp, email, verified_at,
			created_at, updated_at,
			provinces ( name, slug ),
			product_count:products ( count ),
			follower_count:store_followers ( count )
		`,
			{ count: 'exact' }
		)
		.is('deleted_at', null)
		.order('created_at', { ascending: false })
		.range(offset, offset + limit - 1)

	if (params.search) {
		query = query.ilike('name', `%${params.search}%`)
	}

	if (params.status) {
		query = query.eq('status', params.status)
	}

	const { data, error, count } = await query
	if (error) throw error

	// Supabase relational count returns [{ count: N }], extrair o número
	const stores = (data ?? []).map((row) => {
		const productCount = Array.isArray(row.product_count)
			? (row.product_count[0]?.count ?? 0)
			: 0
		const followerCount = Array.isArray(row.follower_count)
			? (row.follower_count[0]?.count ?? 0)
			: 0

		return mapStoreRow({
			...row,
			product_count: productCount,
			follower_count: followerCount,
		})
	})

	const total = count ?? 0
	const hasMore = offset + limit < total

	return apiSuccess({
		stores,
		pagination: {
			total,
			limit,
			offset,
			hasMore,
			nextCursor: hasMore ? String(offset + limit) : null,
		},
	})
})

// ─── POST /api/stores ───────────────────────────────────
// Criar nova loja (vendedor autenticado).

export const POST = withErrorHandling(async (request) => {
	const auth = await requireAuth()

	const roles = await getUserRoles(auth.user.id)
	if (!roles.includes('seller')) {
		return apiError(
			ErrorCode.FORBIDDEN,
			'Apenas vendedores podem criar lojas'
		)
	}

	const body = await request.json()
	const parsed = CreateStoreSchema.safeParse(body)

	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0].message
		)
	}

	const {
		name,
		description,
		provinceId,
		categoryId,
		neighborhood,
		email,
		phone,
		whatsapp,
	} = parsed.data

	const sellerProfile = await ensureSellerProfile(auth.user.id)
	const supabase = createSupabaseAdmin()

	// Gerar slug único
	let slug = Slug(name)
	const { data: slugConflict } = await supabase
		.from('stores')
		.select('id')
		.eq('slug', slug)
		.maybeSingle()

	if (slugConflict) {
		slug = `${slug}-${uuidv7().slice(0, 6)}`
	}

	const { data: store, error } = await supabase
		.from('stores')
		.insert({
			id: uuidv7(),
			owner_id: auth.user.id,
			seller_profile_id: sellerProfile.id,
			name,
			slug,
			description: description ?? null,
			province_id: provinceId,
			main_store_category_id: categoryId ?? null,
			state: neighborhood,
			email: email ?? auth.user.email,
			phone: phone ?? auth.user.phone_number,
			whatsapp: whatsapp ?? phone ?? auth.user.phone_number,
			status: 'PENDING',
		})
		.select('*')
		.single()

	if (error) throw error

	await supabase
		.from('seller_onboarding')
		.update({
			current_step: 'STORE_PROFILE',
			status: 'DRAFT',
			updated_at: new Date().toISOString(),
		})
		.eq('seller_profile_id', sellerProfile.id)

	return apiSuccess({ store }, 201)
})
