'use client'

import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import type { Locale } from '@/lib/preferences/schema'
import { cn } from '@/lib/utils'

const LANGUAGES = [
	{
		id: 'pt' as const,
		nativeName: 'Português',
		region: 'Moçambique',
		lang: 'pt',
		available: true,
	},
	{
		id: 'en' as const,
		nativeName: 'English',
		region: 'Internacional',
		lang: 'en',
		available: false,
	},
] as const

export function LanguageOptions() {
	const { preferences, isAuthenticated, updatePreferences, isUpdating } =
		useUserPreferences()
	const [draft, setDraft] = useState<Locale>(preferences.ui.locale)

	useEffect(() => {
		setDraft(preferences.ui.locale)
	}, [preferences.ui.locale])

	const dirty = draft !== preferences.ui.locale

	async function saveLocale() {
		if (!isAuthenticated) {
			toast.message('Entre na conta para guardar o idioma')
			return
		}
		try {
			await updatePreferences({ ui: { locale: draft } })
			toast.success('Preferências guardadas')
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Não foi possível guardar as preferências'
			)
		}
	}

	return (
		<div className='space-y-6'>
			<RadioGroup
				value={draft}
				onValueChange={(value) => {
					const next = LANGUAGES.find((lang) => lang.id === value)
					if (!next?.available) return
					setDraft(next.id)
				}}
				aria-label='Idioma da aplicação'
				className='grid gap-3'
			>
				{LANGUAGES.map((lang) => {
					const isActive = draft === lang.id
					return (
						<label
							key={lang.id}
							htmlFor={`language-${lang.id}`}
							className={cn(
								'flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left outline-none transition-colors sm:px-5',
								'has-focus-visible:ring-2 has-focus-visible:ring-ring has-focus-visible:ring-offset-2',
								isActive
									? 'border-secondary bg-secondary/5'
									: 'border-border/60 bg-card',
								lang.available
									? 'cursor-pointer [@media(hover:hover)]:hover:border-secondary/50'
									: 'cursor-not-allowed'
							)}
						>
							<div
								className={cn(
									'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors',
									isActive
										? 'bg-secondary text-secondary-foreground'
										: 'bg-muted text-muted-foreground'
								)}
							>
								{isActive ? (
									<Check
										className='size-4'
										strokeWidth={2.5}
										aria-hidden
									/>
								) : (
									<span
										className='text-xs font-semibold tracking-wide'
										aria-hidden
									>
										{lang.id.toUpperCase()}
									</span>
								)}
							</div>

							<div className='min-w-0 flex-1'>
								<p
									lang={lang.lang}
									className={cn(
										'text-base font-semibold',
										isActive
											? 'text-secondary'
											: 'text-foreground'
									)}
								>
									{lang.nativeName}
								</p>
								<p
									className={cn(
										'mt-0.5 text-sm',
										isActive
											? 'text-secondary/80'
											: 'text-muted-foreground'
									)}
								>
									{lang.available
										? lang.region
										: `${lang.region} · Indisponível`}
								</p>
							</div>

							<RadioGroupItem
								id={`language-${lang.id}`}
								value={lang.id}
								disabled={!lang.available}
								className='size-5 border-border disabled:opacity-40 data-checked:border-secondary data-checked:bg-secondary data-checked:text-secondary-foreground dark:data-checked:bg-secondary'
							/>
						</label>
					)
				})}
			</RadioGroup>

			<div className='flex justify-end'>
				<Button
					disabled={!isAuthenticated || !dirty || isUpdating}
					onClick={() => void saveLocale()}
				>
					{isUpdating ? 'A guardar…' : 'Guardar preferências'}
				</Button>
			</div>
		</div>
	)
}
