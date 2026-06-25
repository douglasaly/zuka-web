import { NextResponse } from 'next/server'
import { assignUserRole, ensureSellerProfile } from '@/lib/auth/roles'
import { getSessionUser } from '@/lib/auth/session'

export async function POST(request: Request) {
	try {
		const user = await getSessionUser()
		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { role } = (await request.json()) as { role: 'buyer' | 'seller' }
		if (role !== 'buyer' && role !== 'seller') {
			return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
		}

		await assignUserRole(user.id as string, role)

		if (role === 'seller') {
			await ensureSellerProfile(user.id as string)
		}

		return NextResponse.json({ success: true, role })
	} catch (error) {
		console.error(error)
		return NextResponse.json(
			{ error: 'Failed to set onboarding role' },
			{ status: 500 }
		)
	}
}
