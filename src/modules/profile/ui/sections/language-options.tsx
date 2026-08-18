'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const LANGUAGES = [
	{
		id: 'pt',
		nativeName: 'Português',
		region: 'Moçambique',
		lang: 'pt',
		available: true,
	},
	{
		id: 'en',
		nativeName: 'English',
		region: 'Internacional',
		lang: 'en',
		available: false,
	},
] as const

type LanguageId = (typeof LANGUAGES)[number]['id']

export function LanguageOptions() {
	const [languageId, setLanguageId] = useState<LanguageId>('pt')

	return (
		<RadioGroup
			value={languageId}
			onValueChange={(value) => {
				const next = LANGUAGES.find((lang) => lang.id === value)
				if (!next?.available) return
				setLanguageId(next.id)
			}}
			aria-label='Idioma da aplicação'
			className='grid gap-3'
		>
			{LANGUAGES.map((lang) => {
				const isActive = languageId === lang.id
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
	)
}
