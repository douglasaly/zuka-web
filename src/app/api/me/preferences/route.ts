import { NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/auth/session'
import {
	apiError,
	ErrorCode,
	withErrorHandling,
} from '@/lib/axios/api-response'
import {
	applyPreferencesPatch,
	normalizePreferences,
	UpdatePreferencesSchema,
} from '@/lib/preferences/schema'
import { createSupabaseAdmin } from '@/lib/supabase/admin'
import type { Json } from '@/lib/supabase/types'

export const GET = withErrorHandling(async () => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const supabase = createSupabaseAdmin()
	const { data, error } = await supabase
		.from('user_preferences')
		.select('prefs')
		.eq('user_id', user.id as string)
		.is('deleted_at', null)
		.maybeSingle()
	if (error) throw error
	const isPersisted = Boolean(data)
	const preferences = normalizePreferences(data?.prefs ?? {})
	return NextResponse.json({ success: true, preferences, isPersisted })
})

export const PATCH = withErrorHandling(async (request: Request) => {
	const user = await getSessionUser()
	if (!user) {
		return apiError(ErrorCode.UNAUTHORIZED, 'Não autenticado', 401)
	}
	const parsed = UpdatePreferencesSchema.safeParse(await request.json())
	if (!parsed.success) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			parsed.error.issues[0]?.message ?? 'Dados inválidos'
		)
	}
	if (!parsed.data.ui && !parsed.data.buyer && !parsed.data.seller) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			'Nenhum campo válido para actualizar'
		)
	}
	const supabase = createSupabaseAdmin()
	const userId = user.id as string
	const { data: existing, error: readError } = await supabase
		.from('user_preferences')
		.select('prefs')
		.eq('user_id', userId)
		.is('deleted_at', null)
		.maybeSingle()
	if (readError) throw readError

	const current = normalizePreferences(existing?.prefs ?? {})
	let next: ReturnType<typeof applyPreferencesPatch>
	try {
		next = applyPreferencesPatch(current, parsed.data)
	} catch (err) {
		return apiError(
			ErrorCode.VALIDATION_ERROR,
			err instanceof Error ? err.message : 'Preferências inválidas'
		)
	}

	const now = new Date().toISOString()
	const prefsJson = next as unknown as Json
	if (existing) {
		const { error: updateError } = await supabase
			.from('user_preferences')
			.update({
				prefs: prefsJson,
				updated_at: now,
			} as never)
			.eq('user_id', userId)
			.is('deleted_at', null)
		if (updateError) throw updateError
	} else {
		const { error: insertError } = await supabase
			.from('user_preferences')
			.insert({
				user_id: userId,
				prefs: prefsJson,
				created_at: now,
				updated_at: now,
			} as never)
		if (insertError) throw insertError
	}

	return NextResponse.json({
		success: true,
		preferences: next,
		isPersisted: true,
	})
})
