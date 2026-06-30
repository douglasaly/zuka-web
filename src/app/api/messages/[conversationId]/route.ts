import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

const supabase = createSupabaseAdmin()

export async function GET(req: Request) {
	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		//? Buscar mensagens do usuário
		const { data, error } = await supabase
			.from('messages')
			.select(`
				id,
				content,
				conversation_id,
				created_at
			`)
			.eq('sender_id', user.id)
			.order('created_at', { ascending: false })

		if (error) throw error

		//? Agrupar por conversation_id
		const map = new Map()

		for (const msg of data ?? []) {
			const key = msg.conversation_id

			if (!map.has(key)) {
				map.set(key, {
					conversationId: key,
					lastMessage: msg.content,
					updatedAt: msg.created_at,
					messageCount: 1,
				})
			} else {
				const existing = map.get(key)
				existing.messageCount += 1
				map.set(key, existing)
			}
		}

		//? Converter para array ordenado (mais recente primeiro)
		const conversations = Array.from(map.values()).sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() -
				new Date(a.updatedAt).getTime()
		)

		return NextResponse.json(conversations)
	} catch (err) {
		console.error(err)

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
