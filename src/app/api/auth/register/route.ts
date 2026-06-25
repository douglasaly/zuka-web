import { NextResponse } from 'next/server'
import { syncFirebaseUser } from '@/lib/auth/sync-firebase-user'
import { adminAuth } from '@/lib/firebase/firebase-admin'

export async function POST(request: Request) {
	try {
		const { token } = await request.json()

		const decodedToken = await adminAuth.verifyIdToken(token)
		const user = await syncFirebaseUser(decodedToken)

		return NextResponse.json({
			success: true,
			user: {
				id: user.id,
				firebaseUid: user.firebase_uid,
				email: user.email,
				firstName: user.first_name,
				lastName: user.last_name,
			},
		})
	} catch (error) {
		console.error('Erro ao validar token ou salvar no Supabase:', error)
		return NextResponse.json(
			{ error: 'Validation failed' },
			{ status: 401 }
		)
	}
}
