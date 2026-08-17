'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
export function ChangePasswordHeader() {
	const router = useRouter()
	return (
		<div className='mb-8 flex items-center gap-2'>
			<IconTooltipButton label='Voltar' onClick={() => router.back()}>
				<ArrowLeft className='size-4' />
			</IconTooltipButton>
			<div>
				<h1 className='font-heading text-2xl font-bold md:text-3xl'>
					Alterar palavra-passe
				</h1>
				<p className='text-sm text-muted-foreground'>
					Defina uma nova senha para a sua conta
				</p>
			</div>
		</div>
	)
}
