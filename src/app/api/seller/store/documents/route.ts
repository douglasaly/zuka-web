import { NextResponse } from 'next/server'
import { uuidv7 } from 'uuidv7'
import { mapStoreDocument } from '@/app/api/seller/store/map-store'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { isR2PublicUrl } from '@/lib/storage/r2'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
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
				{ error: 'Documentos de verificação em falta' },
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
		const { data: store } = await supabase
			.from('stores')
			.select('id')
			.eq('owner_id', user.id as string)
			.is('deleted_at', null)
			.order('created_at', { ascending: true })
			.limit(1)
			.maybeSingle()
		if (!store) {
			return NextResponse.json(
				{ error: 'Store not found' },
				{ status: 404 }
			)
		}
		const storeId = store.id as string
		const ownerId = user.id as string
		const now = new Date().toISOString()
		const { data: existing } = await supabase
			.from('verification_documents')
			.select('id, status')
			.eq('store_id', storeId)
			.is('deleted_at', null)
		const canResubmit =
			!existing?.length ||
			existing.some(
				(d) => d.status === 'REJECTED' || d.status === 'PENDING'
			)
		if (!canResubmit && existing?.every((d) => d.status === 'APPROVED')) {
			return NextResponse.json(
				{ error: 'Os documentos já foram aprovados' },
				{ status: 400 }
			)
		}
		if (existing?.length) {
			await supabase
				.from('verification_documents')
				.update({ deleted_at: now, updated_at: now })
				.eq('store_id', storeId)
				.is('deleted_at', null)
				.in('status', ['PENDING', 'REJECTED'])
		}
		const { data: inserted, error: docsError } = await supabase
			.from('verification_documents')
			.insert([
				{
					id: uuidv7(),
					owner_id: ownerId,
					store_id: storeId,
					type: 'ID_CARD' as const,
					status: 'PENDING' as const,
					file_url: idCardUrl,
				},
				{
					id: uuidv7(),
					owner_id: ownerId,
					store_id: storeId,
					type: 'OTHER' as const,
					status: 'PENDING' as const,
					file_url: selfieUrl,
					metadata: JSON.stringify({ kind: 'selfie_with_document' }),
				},
			])
			.select(
				'id, type, status, file_url, back_file_url, rejection_reason, reviewed_at, created_at, metadata'
			)
		if (docsError) throw docsError
		return NextResponse.json({
			success: true,
			documents: (inserted ?? []).map(mapStoreDocument),
		})
	} catch (error) {
		console.error('[POST /api/seller/store/documents]', error)
		return NextResponse.json(
			{ error: 'Failed to submit documents' },
			{ status: 500 }
		)
	}
}
