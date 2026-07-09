'use client'

import { ArrowLeft, Check, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'

const LANGUAGES = [
	{
		id: 'pt',
		label: 'Português',
		region: 'Moçambique',
		active: true,
	},
	{
		id: 'en',
		label: 'English',
		region: 'Internacional',
		active: false,
	},
]

export const LanguageView = () => {
	const router = useRouter()

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<div className='mb-8 flex items-center gap-2'>
				<Tooltip>
					<TooltipTrigger
						render={
							<Button
								variant='ghost'
								onClick={() => router.back()}
							>
								<ArrowLeft className='size-4' />
							</Button>
						}
					/>
					<TooltipContent>Voltar</TooltipContent>
				</Tooltip>
				<div>
					<h1 className='font-heading text-2xl font-bold md:text-3xl'>
						Idioma
					</h1>
					<p className='text-sm text-muted-foreground'>
						Escolha o idioma da aplicação
					</p>
				</div>
			</div>

			<Card className='border-border/60'>
				<CardHeader>
					<div className='flex size-12 items-center justify-center rounded-full bg-secondary/10 mb-3'>
						<Globe className='size-6 text-secondary' />
					</div>
					<CardTitle className='font-heading'>Idioma</CardTitle>
					<CardDescription>
						O Zuka está disponível em português. Em breve teremos
						mais opções.
					</CardDescription>
				</CardHeader>

				<CardContent className='space-y-2'>
					{LANGUAGES.map((lang) => (
						<div
							key={lang.id}
							className={`flex items-center justify-between rounded-xl border p-4 ${
								lang.active
									? 'border-secondary/30 bg-secondary/5'
									: 'border-border/60 opacity-50'
							}`}
						>
							<div className='flex items-center gap-3'>
								<div
									className={`flex size-10 items-center justify-center rounded-full ${
										lang.active
											? 'bg-secondary text-secondary-foreground'
											: 'bg-muted text-muted-foreground'
									}`}
								>
									<span className='text-sm font-bold'>
										{lang.label[0]}
									</span>
								</div>
								<div>
									<p className='text-sm font-medium'>
										{lang.label}
									</p>
									<p className='text-xs text-muted-foreground'>
										{lang.region}
									</p>
								</div>
							</div>

							{lang.active ? (
								<div className='flex size-6 items-center justify-center rounded-full bg-secondary'>
									<Check className='size-3.5 text-secondary-foreground' />
								</div>
							) : (
								<span className='text-xs text-muted-foreground'>
									Em breve
								</span>
							)}
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	)
}
