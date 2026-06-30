import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import { createSupabaseAdmin } from '@/lib/supabase/admin'

const supabase = createSupabaseAdmin()

export async function GET() {
	try {
		const user = await getSessionUser()

		if (!user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		//? pegar conversations direto (SEM messages)
		const { data: conversations, error } = await supabase
			.from('conversations')
			.select(`
				id,
				last_message_at,
				last_message_id,
				store_id,
				stores (
					id,
					name,
					logo_url
				),
				conversation_participants!inner (
					user_id
				)
			`)
			.eq('conversation_participants.user_id', user.id)
			.order('last_message_at', { ascending: false })

		if (error) throw error

		//? montar inbox direto (SEM loops pesados)
		const inbox =
			conversations?.map((c) => ({
				conversationId: c.id,

				// 💬 última mensagem já cacheada
				lastMessage: '', // opcional (vem de last_message_id se quiser expandir)

				updatedAt: c.last_message_at,

				// 🏪 store direto
				storeName: c.stores?.name ?? 'Loja',
				storeLogo: c.stores?.logo_url ?? null,
			})) ?? []

		return NextResponse.json({ data: inbox })
	} catch (err) {
		console.error(err)

		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
