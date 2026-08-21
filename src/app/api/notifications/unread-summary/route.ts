import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import {
	apiError,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { NotificationType } from '@/types'

const TRACKED_TYPES: NotificationType[] = [
	'order',
	'message',
	'promotion',
	'offer',
	'follow',
	'review',
	'system',
]

export type UnreadNotificationSummary = {
	total: number
	byType: Record<NotificationType, number>
}

export const GET = withErrorHandling(async () => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const supabase = createSupabaseAdmin()
	const userId = user.id as string

	const results = await Promise.all(
		TRACKED_TYPES.map(async (type) => {
			const { count, error } = await supabase
				.from('notifications')
				.select('id', { head: true, count: 'exact' })
				.eq('user_id', userId)
				.eq('type', type)
				.is('deleted_at', null)
				.is('read_at', null)
			if (error) throw error
			return [type, count ?? 0] as const
		})
	)

	const byType = Object.fromEntries(results) as Record<
		NotificationType,
		number
	>
	const total = results.reduce((sum, [, n]) => sum + n, 0)

	return NextResponse.json({
		success: true,
		total,
		byType,
	} satisfies { success: true } & UnreadNotificationSummary)
})
