import { z } from 'zod'

export const LocaleSchema = z.enum(['pt', 'en'])
export const ThemeSchema = z.enum(['light', 'dark', 'system'])

export const PreferencesDocumentSchema = z.object({
	ui: z.object({
		locale: LocaleSchema,
		theme: ThemeSchema,
	}),
	buyer: z.object({
		notifications: z.object({
			orders: z.boolean(),
			promotions: z.boolean(),
			messages: z.boolean(),
		}),
		privacy: z.object({
			profileVisible: z.boolean(),
		}),
	}),
	seller: z.object({
		notifications: z.object({
			orders: z.boolean(),
			messages: z.boolean(),
			reviews: z.boolean(),
		}),
	}),
})

export type PreferencesDocument = z.infer<typeof PreferencesDocumentSchema>
export type Locale = z.infer<typeof LocaleSchema>
export type ThemePreference = z.infer<typeof ThemeSchema>

/** Locales the UI currently allows selecting. */
export const AVAILABLE_LOCALES: readonly Locale[] = ['pt'] as const

export const DEFAULT_PREFERENCES: PreferencesDocument = {
	ui: {
		locale: 'pt',
		theme: 'light',
	},
	buyer: {
		notifications: {
			orders: true,
			promotions: true,
			messages: true,
		},
		privacy: {
			profileVisible: true,
		},
	},
	seller: {
		notifications: {
			orders: true,
			messages: true,
			reviews: true,
		},
	},
}

/** Partial PATCH body — deep-merge into stored prefs. */
export const UpdatePreferencesSchema = z.object({
	ui: z
		.object({
			locale: LocaleSchema.optional(),
			theme: ThemeSchema.optional(),
		})
		.optional(),
	buyer: z
		.object({
			notifications: z
				.object({
					orders: z.boolean().optional(),
					promotions: z.boolean().optional(),
					messages: z.boolean().optional(),
				})
				.optional(),
			privacy: z
				.object({
					profileVisible: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
	seller: z
		.object({
			notifications: z
				.object({
					orders: z.boolean().optional(),
					messages: z.boolean().optional(),
					reviews: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
})

export type UpdatePreferencesInput = z.infer<typeof UpdatePreferencesSchema>

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Deep-merge plain objects; arrays/primitives from `patch` replace. */
export function deepMerge<T extends Record<string, unknown>>(
	base: T,
	patch: Record<string, unknown>
): T {
	const out: Record<string, unknown> = { ...base }
	for (const [key, value] of Object.entries(patch)) {
		if (value === undefined) continue
		const current = out[key]
		if (isPlainObject(current) && isPlainObject(value)) {
			out[key] = deepMerge(current, value)
		} else {
			out[key] = value
		}
	}
	return out as T
}

export function normalizePreferences(raw: unknown): PreferencesDocument {
	const merged = deepMerge(
		DEFAULT_PREFERENCES as unknown as Record<string, unknown>,
		isPlainObject(raw) ? raw : {}
	)
	const parsed = PreferencesDocumentSchema.safeParse(merged)
	return parsed.success ? parsed.data : DEFAULT_PREFERENCES
}

export function applyPreferencesPatch(
	current: PreferencesDocument,
	patch: UpdatePreferencesInput
): PreferencesDocument {
	if (patch.ui?.locale !== undefined) {
		if (!AVAILABLE_LOCALES.includes(patch.ui.locale)) {
			throw new Error('Idioma indisponível')
		}
	}
	const merged = deepMerge(
		current as unknown as Record<string, unknown>,
		patch as unknown as Record<string, unknown>
	)
	return PreferencesDocumentSchema.parse(merged)
}
