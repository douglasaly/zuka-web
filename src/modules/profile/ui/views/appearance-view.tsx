'use client'
import { ArrowLeft, Laptop, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import type { ThemePreference } from '@/lib/preferences/schema'

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
	const { setTheme } = useTheme()
	const { preferences, isAuthenticated, updatePreferences, isUpdating } =
		useUserPreferences()
	const [mounted, setMounted] = useState(false)
	const [draft, setDraft] = useState<ThemePreference>(preferences.ui.theme)

	useEffect(() => {
		setMounted(true)
	}, [])

	useEffect(() => {
		setDraft(preferences.ui.theme)
	}, [preferences.ui.theme])

	const dirty = draft !== preferences.ui.theme

	function selectTheme(id: ThemePreference) {
		setDraft(id)
		setTheme(id)
	}

	async function saveTheme() {
		if (!isAuthenticated) {
			toast.message('Tema aplicado neste dispositivo')
			return
		}
		try {
			await updatePreferences({ ui: { theme: draft } })
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

			<div className='flex flex-col justify-center items-center h-full min-h-[60vh] gap-8'>
				<div className='grid gap-4 sm:grid-cols-3'>
					{THEMES.map(({ id, label, description, icon: Icon }) => {
						const active = mounted && draft === id
						return (
							<button
								type='button'
								key={id}
								onClick={() => selectTheme(id)}
								className={`group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all hover:border-secondary/50 ${
									active
										? 'border-secondary bg-secondary/5'
										: 'border-border/60 bg-card'
								}`}
							>
								<div
									className={`flex size-12 items-center justify-center rounded-full transition-colors ${
										active
											? 'bg-secondary text-secondary-foreground'
											: 'bg-muted text-muted-foreground group-hover:bg-secondary/10'
									}`}
								>
									<Icon className='size-6' />
								</div>

								<div>
									<p
										className={`text-sm font-semibold ${
											active
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

								{active && (
									<div className='absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-secondary'>
										<div className='size-2 rounded-full bg-secondary-foreground' />
									</div>
								)}
							</button>
						)
					})}
				</div>

				<Button
					disabled={isAuthenticated ? !dirty || isUpdating : false}
					onClick={() => void saveTheme()}
				>
					{isUpdating ? 'A guardar…' : 'Guardar preferências'}
				</Button>
			</div>
		</div>
	)
}
