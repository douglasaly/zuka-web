import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { mapSellerStoreDetail } from '@/app/api/seller/store/map-store'
import { isSellerStoreAuthError, requireSellerStore } from '@/lib/auth/seller'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'
import { UpdateSellerStoreSchema } from '@/lib/validations'
import { Slug } from '@/utils/slug'

const STORE_SELECT = `
	id, name, slug, description, logo_url, banner_url, phone, whatsapp, email,
	province_id, state, status, verified_at,
	has_delivery, delivery_zones,
	provinces ( name )
`

type StoreStatus = Database['public']['Enums']['store_status']
type StoreRow = NonNullable<
	Awaited<ReturnType<typeof fetchStoreDetail>>['store']
>

async function fetchStoreDetail(storeId: string) {
	const supabase = createSupabaseAdmin()

	const { data: store, error } = await supabase
		.from('stores')
		.select(STORE_SELECT)
		.eq('id', storeId)
		.is('deleted_at', null)
		.maybeSingle()

	if (error) throw error
	return { supabase, store }
}

async function loadStoreBundle(
	supabase: ReturnType<typeof createSupabaseAdmin>,
	storeId: string,
	store: StoreRow
) {
	const [{ count }, { data: documents }] = await Promise.all([
		supabase
			.from('products')
			.select('id', { count: 'exact', head: true })
			.eq('store_id', storeId)
			.is('deleted_at', null),
		supabase
			.from('verification_documents')
			.select(
				'id, type, status, file_url, back_file_url, rejection_reason, reviewed_at, created_at, metadata'
			)
			.eq('store_id', storeId)
			.is('deleted_at', null)
			.order('created_at', { ascending: false }),
	])

	return mapSellerStoreDetail(store, count ?? 0, documents ?? [])
}

export async function GET() {
	try {
		const auth = await requireSellerStore({ permission: 'store.read' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const { supabase, store } = await fetchStoreDetail(auth.store.id)
		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		const detail = await loadStoreBundle(
			supabase,
			store.id as string,
			store
		)
		return NextResponse.json({ success: true, store: detail })
	} catch (error) {
		console.error('[GET /api/seller/store]', error)
		return NextResponse.json(
			{ error: 'Failed to load store' },
			{ status: 500 }
		)
	}
}

export async function PATCH(request: Request) {
	try {
		const auth = await requireSellerStore({ permission: 'store.update' })
		if (isSellerStoreAuthError(auth)) return auth.error

		const user = auth.user
		const body = await request.json()
		const parsed = UpdateSellerStoreSchema.safeParse(body)
		if (!parsed.success) {
			return NextResponse.json(
				{ error: parsed.error.issues[0]?.message ?? 'Dados inválidos' },
				{ status: 400 }
			)
		}

		const {
			name,
			slug,
			logoUrl,
			bannerUrl,
			description,
			phone,
			whatsapp,
			email,
			provinceId,
			neighborhood,
			status,
			hasDelivery,
			deliveryZones,
			currentStep,
		} = parsed.data

		const { supabase, store } = await fetchStoreDetail(auth.store.id)
		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		if (logoUrl && logoUrl !== store.logo_url && !isR2PublicUrl(logoUrl)) {
			return NextResponse.json(
				{ error: 'O logo deve ser carregado para o armazenamento' },
				{ status: 400 }
			)
		}

		if (
			bannerUrl &&
			bannerUrl !== store.banner_url &&
			!isR2PublicUrl(bannerUrl)
		) {
			return NextResponse.json(
				{ error: 'O banner deve ser carregado para o armazenamento' },
				{ status: 400 }
			)
		}

		const updates: Database['public']['Tables']['stores']['Update'] = {
			updated_at: new Date().toISOString(),
		}

		if (typeof name === 'string' && name.trim()) {
			updates.name = name.trim()
		}

		if (typeof slug === 'string' && slug.trim()) {
			const nextSlug = Slug(slug)
			if (!nextSlug) {
				return NextResponse.json(
					{ error: 'Slug inválido' },
					{ status: 400 }
				)
			}

			if (nextSlug !== store.slug) {
				const { data: conflict } = await supabase
					.from('stores')
					.select('id')
					.eq('slug', nextSlug)
					.neq('id', store.id as string)
					.maybeSingle()

				if (conflict) {
					return NextResponse.json(
						{ error: 'Este slug já está em uso' },
						{ status: 409 }
					)
				}
			}

			updates.slug = nextSlug
		}

		if (logoUrl !== undefined && logoUrl !== store.logo_url) {
			updates.logo_url = logoUrl
		}
		if (bannerUrl !== undefined && bannerUrl !== store.banner_url) {
			updates.banner_url = bannerUrl
		}
		if (description !== undefined) {
			updates.description =
				description === null || description === '' ? null : description
		}
		if (phone !== undefined) updates.phone = phone ?? null
		if (whatsapp !== undefined) updates.whatsapp = whatsapp ?? null
		if (email !== undefined) {
			updates.email = email === null || email === '' ? null : email.trim()
		}
		if (provinceId !== undefined) updates.province_id = provinceId
		if (typeof neighborhood === 'string')
			updates.state = neighborhood.trim()

		if (status === 'ACTIVE' || status === 'INACTIVE') {
			const current = store.status as StoreStatus | null
			if (
				current === 'BANNED' ||
				current === 'SUSPENDED' ||
				current === 'PENDING'
			) {
				return NextResponse.json(
					{
						error: 'O estado da loja não pode ser alterado enquanto estiver pendente, suspensa ou banida.',
					},
					{ status: 400 }
				)
			}
			updates.status = status
		}

		if (hasDelivery !== undefined)
			updates.has_delivery = Boolean(hasDelivery)
		if (Array.isArray(deliveryZones)) {
			updates.delivery_zones = deliveryZones
				.map((z: unknown) => String(z).trim())
				.filter(Boolean)
		}

		const { error: storeError } = await supabase
			.from('stores')
			.update(updates)
			.eq('id', store.id as string)

		if (storeError) throw storeError

		if (currentStep || hasDelivery !== undefined) {
			const { data: sellerProfile } = await supabase
				.from('seller_profiles')
				.select('id')
				.eq('user_id', user.id as string)
				.maybeSingle()

			if (sellerProfile) {
				const { data: onboarding } = await supabase
					.from('seller_onboarding')
					.select('id')
					.eq('seller_profile_id', sellerProfile.id as string)
					.maybeSingle()

				if (onboarding) {
					const onboardingUpdates: Record<string, unknown> = {
						updated_at: new Date().toISOString(),
					}
					if (currentStep)
						onboardingUpdates.current_step = currentStep

					await supabase
						.from('seller_onboarding')
						.update(
							onboardingUpdates as Database['public']['Tables']['seller_onboarding']['Update']
						)
						.eq('id', onboarding.id as string)

					if (hasDelivery !== undefined) {
						await supabase.from('seller_onboarding_steps').insert({
							id: uuidv7(),
							onboarding_id: onboarding.id as string,
							step: 'STORE_PROFILE',
							data: { hasDelivery },
							completed: true,
						})
					}
				}
			}
		}

		const { store: refreshed } = await fetchStoreDetail(auth.store.id)
		if (!refreshed) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		const detail = await loadStoreBundle(
			supabase,
			refreshed.id as string,
			refreshed
		)

		return NextResponse.json({ success: true, store: detail })
	} catch (error) {
		console.error('[PATCH /api/seller/store]', error)
		return NextResponse.json(
			{ error: 'Failed to update store' },
			{ status: 500 }
		)
	}
}
