import { NextResponse } from 'next/server'
import { db } from '@/db'
import { provinces } from '@/db/schema/provinces'
import type { Province } from './types'

export async function GET() {
	try {
		const data = await db.select().from(provinces)

		return NextResponse.json<Province[]>(data)
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar províncias',
			},
			{ status: 500 }
		)
	}
}
