import { NextResponse } from 'next/server'
import { getUserRoles } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function requireSellerStore() {
	const user = await getSessionUser()
	if (!user) {
		return {
			error: NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			),
		}
	}

	const roles = await getUserRoles(user.id as string)
	if (!roles.includes('seller')) {
		return {
			error: NextResponse.json(
				{ error: 'Apenas lojas podem publicar produtos' },
				{ status: 403 }
			),
		}
	}

	const supabase = createSupabaseAdmin()
	const { data: store, error } = await supabase
		.from('stores')
		.select('id, name, slug, owner_id, status')
		.eq('owner_id', user.id as string)
		.is('deleted_at', null)
		.order('created_at', { ascending: true })
		.limit(1)
		.maybeSingle()

	if (error) throw error

	if (!store) {
		return {
			error: NextResponse.json(
				{
					error: 'Crie a sua loja antes de publicar produtos. No Zuka, apenas lojas vendem.',
				},
				{ status: 400 }
			),
		}
	}

	return { user, store }
}
