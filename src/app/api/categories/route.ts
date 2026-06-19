import { NextResponse } from 'next/server'
import { db } from '@/db'
import { categories } from '@/db/schema/categories'
import type { Category } from './types'

export async function GET() {
	try {
		const data = await db.select().from(categories)

		return NextResponse.json<Category[]>(data)
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar categorias',
			},
			{ status: 500 }
		)
	}
}

export async function POST() {}
