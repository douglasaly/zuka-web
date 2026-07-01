'use client'

import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { auth } from '@/lib/firebase/firebase-client'

export default function LogOutPage() {
	const router = useRouter()

	useEffect(() => {
		async function logout() {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			})
			await signOut(auth)
			router.replace('/')
		}

		logout()
	}, [router])

	return (
		<div className='flex min-h-screen items-center justify-center text-sm text-muted-foreground'>
			A sair...
		</div>
	)
}
