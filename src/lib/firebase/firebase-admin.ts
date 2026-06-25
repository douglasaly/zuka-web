import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
	process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099'
}

if (!getApps().length) {
	initializeApp({
		credential: cert({
			projectId: process.env.FIREBASE_PROJECT_ID,
			clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
			privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
		}),
	})
}

export const adminAuth = getAuth()
