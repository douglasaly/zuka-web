'use client'
import { ArrowLeft, Laptop, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'

const THEMES = [
	{
		id: 'light' as const,
		label: 'Claro',
		description: 'Tema claro para ambientes bem iluminados',
		icon: Sun,
	},
	{
		id: 'dark' as const,
		label: 'Escuro',
		description: 'Tema escuro para ambientes com pouca luz',
		icon: Moon,
	},
	{
		id: 'system' as const,
		label: 'Sistema',
		description: 'Acompanha a preferência do seu dispositivo',
		icon: Laptop,
	},
]
export const AppearanceView = () => {
	const router = useRouter()
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])
	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<div className='mb-8 flex items-center gap-2'>
				<IconTooltipButton label='Voltar' onClick={() => router.back()}>
					<ArrowLeft className='size-4' />
				</IconTooltipButton>
				<div>
					<h1 className='font-heading text-2xl font-bold md:text-3xl'>
						Aparência
					</h1>
					<p className='text-sm text-muted-foreground'>
						Personalize a aparência da aplicação
					</p>
				</div>
			</div>

			<div className='flex flex-col justify-center items-center h-full min-h-[60vh]'>
				<div className='grid gap-4 sm:grid-cols-3'>
					{THEMES.map(({ id, label, description, icon: Icon }) => {
						const isActive = mounted && theme === id
						return (
							<button
								type='button'
								key={id}
								onClick={() => setTheme(id)}
								className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all hover:border-secondary/50 ${
									isActive
										? 'border-secondary bg-secondary/5'
										: 'border-border/60 bg-card'
								}`}
							>
								<div
									className={`flex size-12 items-center justify-center rounded-full transition-colors ${
										isActive
											? 'bg-secondary text-secondary-foreground'
											: 'bg-muted text-muted-foreground group-hover:bg-secondary/10'
									}`}
								>
									<Icon className='size-6' />
								</div>

								<div>
									<p
										className={`text-sm font-semibold ${
											isActive
												? 'text-secondary'
												: 'text-foreground'
										}`}
									>
										{label}
									</p>
									<p className='mt-1 text-xs text-muted-foreground'>
										{description}
									</p>
								</div>

								{isActive && (
									<div className='absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-secondary'>
										<div className='size-2 rounded-full bg-secondary-foreground' />
									</div>
								)}
							</button>
						)
					})}
				</div>
			</div>
		</div>
	)
}
