import { eq } from 'drizzle-orm'
import { getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from './../../../../db/schema/users'

if (!getApps().length) initializeApp()

export async function POST(request: Request) {
	try {
		const { token } = await request.json()

		const decodedToken = await getAuth().verifyIdToken(token)
		console.log(decodedToken)

		const {
			uid: firebaseUid,
			email,
			name,
			picture,
			phone_number,
			email_verified,
		} = decodedToken

		const fullName = name || decodedToken.name || 'Usuário'

		const nameParts = fullName.trim().split(' ')

		const firstName = nameParts[0]
		const lastName =
			nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

		const [userExists] = await db
			.select()
			.from(users)
			.where(eq(users.firebaseUid, firebaseUid))

		if (!userExists) {
			await db.insert(users).values({
				firebaseUid,
				email: email,
				firstName,
				lastName,
				avatarUrl: picture,
				phoneNumber: phone_number,
				emailVerified: email_verified ? email_verified : false,
			})
			console.log(
				`Novo usuário registrado com sucesso no banco de dados próprio: ${email}`
			)
		}

		return NextResponse.json({
			success: true,
			user: { firebaseUid, email, fullName },
		})
	} catch (error) {
		console.error('Erro ao validar token ou salvar no banco:', error)
		return NextResponse.json(
			{ error: 'Validation failed' },
			{ status: 401 }
		)
	}
}
