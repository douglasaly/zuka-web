'use client'
import { ShieldX } from 'lucide-react'
export function ForbiddenView() {
	return (
		<div className='flex min-h-dvh flex-col bg-background'>
			<main
				id='main-content'
				className='mx-auto flex w-full max-w-lg flex-1 flex-col px-4 sm:px-6'
			>
				<div className='flex flex-1 flex-col items-center justify-center py-10 text-center sm:py-14'>
					<div
						className='flex size-16 items-center justify-center rounded-full bg-red-100 sm:size-20'
						aria-hidden
					>
						<ShieldX className='size-8 text-red-500 sm:size-9' />
					</div>

					<h1 className='mt-2 font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
						Acesso negado
					</h1>
				</div>
			</main>
		</div>
	)
}
