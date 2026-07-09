import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { adminAuth } from '@/lib/firebase/firebase-admin'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json(
				{ error: 'Não autenticado' },
				{ status: 401 }
			)
		}

		const supabase = createSupabaseAdmin()

		const { error: rpcError } = await supabase.rpc('delete_user_account', {
			p_user_id: user.id,
		})

		if (rpcError) {
			throw rpcError
		}

		await adminAuth.deleteUser(user.firebase_uid)

		const response = NextResponse.json({ success: true })

		response.cookies.set('session', '', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 0,
		})

		return response
	} catch (err) {
		console.error('[DELETE ACCOUNT]', err)
		return NextResponse.json(
			{ error: 'Erro ao eliminar conta. Tente novamente.' },
			{ status: 500 }
		)
	}
}
