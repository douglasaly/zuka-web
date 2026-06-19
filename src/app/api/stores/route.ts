import { and, desc, ilike } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { stores } from '@/db/schema/stores'

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url)
		const search = searchParams.get('search')
		const page = Number(searchParams.get('page') ?? 1)

		const limit = Math.min(Number(searchParams.get('limit') ?? 8), 15)
		const offset = (page - 1) * limit

		const conditions = []

		if (search) {
			conditions.push(ilike(stores.name, `%${search}%`))
		}

		const whereClause = conditions.length ? and(...conditions) : undefined

		//! query principal
		const data = await db
			.select()
			.from(stores)
			.where(whereClause)
			.orderBy(desc(stores.createdAt))
			.limit(limit)
			.offset(offset)

		const response = {
			success: true,
			stores: data,
			metadata: {
				page,
				limit,
				totalCount: data.length,
			},
		}

		return NextResponse.json(response)
	} catch (error) {
		return NextResponse.json(
			{
				error,
				success: false,
				message: 'Erro ao buscar stores',
			},
			{ status: 500 }
		)
	}
}
