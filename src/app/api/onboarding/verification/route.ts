import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import { isR2PublicUrl } from '@/lib/storage/r2'

export async function POST(request: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const roles = await getUserRoles(user.id as string)
		if (!roles.includes('seller')) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
		}

		const { idCardUrl, selfieUrl } = await request.json()

		if (!idCardUrl || !selfieUrl) {
			return NextResponse.json(
				{ error: 'Missing verification documents' },
				{ status: 400 }
			)
		}

		if (!isR2PublicUrl(idCardUrl) || !isR2PublicUrl(selfieUrl)) {
			return NextResponse.json(
				{
					error: 'Os documentos devem ser carregados para o armazenamento',
				},
				{ status: 400 }
			)
		}

		const supabase = createSupabaseAdmin()

		const { data: sellerProfile } = await supabase
			.from('seller_profiles')
			.select('id')
			.eq('user_id', user.id as string)
			.maybeSingle()

		if (!sellerProfile) {
			return NextResponse.json(
				{ error: 'Seller profile not found' },
				{ status: 404 }
			)
		}

		const { data: store } = await supabase
			.from('stores')
			.select('id')
			.eq('seller_profile_id', sellerProfile.id as string)
			.is('deleted_at', null)
			.maybeSingle()

		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}

		const storeId = store.id as string
		const ownerId = user.id as string

		const { error: docsError } = await supabase
			.from('verification_documents')
			.insert([
				{
					id: uuidv7(),
					owner_id: ownerId,
					store_id: storeId,
					type: 'ID_CARD',
					status: 'PENDING',
					file_url: idCardUrl,
				},
				{
					id: uuidv7(),
					owner_id: ownerId,
					store_id: storeId,
					type: 'OTHER',
					status: 'PENDING',
					file_url: selfieUrl,
					metadata: JSON.stringify({ kind: 'selfie_with_document' }),
				},
			])

		if (docsError) throw docsError

		const { data: onboarding } = await supabase
			.from('seller_onboarding')
			.select('id')
			.eq('seller_profile_id', sellerProfile.id as string)
			.maybeSingle()

		if (onboarding) {
			await supabase
				.from('seller_onboarding')
				.update({
					status: 'SUBMITTED',
					current_step: null,
					submitted_at: new Date().toISOString(),
					updated_at: new Date().toISOString(),
				})
				.eq('id', onboarding.id as string)

			await supabase.from('seller_onboarding_steps').insert({
				id: uuidv7(),
				onboarding_id: onboarding.id as string,
				step: 'VERIFICATION',
				data: { submitted: true },
				completed: true,
			})
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to submit verification' },
			{ status: 500 }
		)
	}
}
