'use client'
import { AlertTriangle, Ban, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

function getStatusFromDigest(digest?: string): number | null {
	if (!digest) return null
	const match = digest.match(/\d{3}/)
	return match ? Number(match[0]) : null
}
const ERROR_MESSAGES: Record<
	number,
	{
		icon: typeof AlertTriangle
		title: string
		description: string
	}
> = {
	429: {
		icon: Clock,
		title: 'Muitos pedidos',
		description:
			'Recebemos muitos pedidos do seu dispositivo. Aguarde alguns instantes e tente novamente.',
	},
	500: {
		icon: AlertTriangle,
		title: 'Erro interno',
		description:
			'Ocorreu um erro no servidor. Tente novamente ou volte mais tarde.',
	},
	404: {
		icon: Ban,
		title: 'Página não encontrada',
		description: 'A página que procura não existe ou foi movida.',
	},
}
export default function PageError({
	error,
	reset,
}: {
	error: Error & {
		digest?: string
	}
	reset: () => void
}) {
	const status = getStatusFromDigest(error.digest)
	const config = status ? ERROR_MESSAGES[status] : null
	const {
		icon: Icon,
		title,
		description,
	} = config ?? {
		icon: AlertTriangle,
		title: 'Algo correu mal',
		description:
			'Ocorreu um erro inesperado. Tente novamente ou volte mais tarde.',
	}
	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4 text-center'>
			<div className='flex size-16 items-center justify-center rounded-full bg-destructive/10'>
				<Icon className='size-8 text-destructive' />
			</div>
			<h1 className='mt-6 font-heading text-3xl font-bold'>{title}</h1>
			<p className='mt-2 max-w-sm text-muted-foreground'>{description}</p>
			<div className='mt-8 flex gap-3'>
				<Button
					variant='outline'
					className='rounded-full'
					onClick={() => {
						window.location.href = '/'
					}}
				>
					Voltar ao início
				</Button>
				<Button className='rounded-full' onClick={reset}>
					Tentar novamente
				</Button>
			</div>
		</div>
	)
}
