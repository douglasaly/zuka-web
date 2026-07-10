'use client'

import { Bell, Lock, LogOut, Store } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

type SettingSection = {
	icon: typeof Bell
	title: string
	description: string
	action: {
		label: string
		href?: string
		onClick?: () => void
		variant?: 'default' | 'outline' | 'destructive'
	}
}

export const SellerSettingsView = () => {
	const sections: SettingSection[] = [
		{
			icon: Bell,
			title: 'Notificações',
			description: 'Gerir preferências de notificações por email e push.',
			action: { label: 'Configurar', href: '#' },
		},
		{
			icon: Store,
			title: 'Perfil da loja',
			description:
				'Editar nome, descrição, logótipo e informações da loja.',
			action: { label: 'Editar loja', href: '/dashboard/seller/loja' },
		},
		{
			icon: Lock,
			title: 'Segurança',
			description: 'Alterar palavra-passe da sua conta.',
			action: { label: 'Alterar', href: '#' },
		},
		{
			icon: LogOut,
			title: 'Encerrar conta',
			description: 'Eliminar permanentemente a sua conta e loja.',
			action: {
				label: 'Encerrar',
				variant: 'destructive',
				onClick: () => {
					// TODO: confirm dialog + API call
				},
			},
		},
	]

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='font-heading text-xl font-bold'>
					Configurações
				</h1>
				<p className='text-sm text-muted-foreground'>
					Gerir as definições da sua conta e loja
				</p>
			</div>

			<div className='space-y-3'>
				{sections.map((section) => {
					const Icon = section.icon
					return (
						<div
							key={section.title}
							className='flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5'
						>
							<div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
								<Icon className='size-5 text-muted-foreground' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='font-medium'>{section.title}</p>
								<p className='text-sm text-muted-foreground'>
									{section.description}
								</p>
							</div>
							{section.action.href ? (
								<Button
									variant={
										section.action.variant ?? 'outline'
									}
									size='sm'
									className='shrink-0 rounded-full'
									render={
										<Link href={section.action.href}>
											{section.action.label}
										</Link>
									}
								/>
							) : (
								<Button
									variant={
										section.action.variant ?? 'outline'
									}
									size='sm'
									className='shrink-0 rounded-full'
									onClick={section.action.onClick}
								>
									{section.action.label}
								</Button>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
