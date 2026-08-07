'use client'

import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

export function SellerMembersLoading() {
	return (
		// biome-ignore lint/a11y/useAriaPropsSupportedByRole: loading region uses aria-busy + label
		<div
			className='w-full min-w-0 space-y-6'
			aria-busy='true'
			aria-label='A carregar membros'
		>
			<Skeleton className='h-4 w-72 max-w-full' />
			<div className='flex items-center justify-between gap-3'>
				<Skeleton className='h-4 w-28' />
				<Skeleton className='h-9 w-28 rounded-full' />
			</div>
			<div className='space-y-2'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4'
					>
						<Skeleton className='size-10 rounded-full' />
						<div className='flex-1 space-y-1.5'>
							<Skeleton className='h-4 w-36' />
							<Skeleton className='h-3 w-48' />
						</div>
						<Skeleton className='h-6 w-16 rounded-full' />
					</div>
				))}
			</div>
		</div>
	)
}

type SellerMembersErrorProps = {
	forbidden: boolean
	onRetry: () => void
}

export function SellerMembersError({
	forbidden,
	onRetry,
}: SellerMembersErrorProps) {
	return (
		<Empty className='rounded-2xl border border-dashed border-border bg-muted/20 py-16'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<Users />
				</EmptyMedia>
				<EmptyTitle>
					{forbidden
						? 'Sem acesso à Equipe'
						: 'Não foi possível carregar os membros'}
				</EmptyTitle>
				<EmptyDescription>
					{forbidden
						? 'O dono da loja define quem pode ver e gerir membros.'
						: 'Confirma a migration store_members e corre yarn db:seed:rbac, depois tenta outra vez.'}
				</EmptyDescription>
			</EmptyHeader>
			{!forbidden ? (
				<EmptyContent>
					<Button
						variant='outline'
						className='rounded-full'
						onClick={onRetry}
					>
						Tentar novamente
					</Button>
				</EmptyContent>
			) : null}
		</Empty>
	)
}

type SellerMembersEmptyProps = {
	canManage: boolean
	onInvite: () => void
}

export function SellerMembersEmpty({
	canManage,
	onInvite,
}: SellerMembersEmptyProps) {
	return (
		<Empty className='rounded-2xl border border-dashed border-border bg-muted/20 py-16'>
			<EmptyHeader>
				<EmptyMedia variant='icon'>
					<Users />
				</EmptyMedia>
				<EmptyTitle>Ainda sem Equipe</EmptyTitle>
				<EmptyDescription>
					{canManage
						? 'Convida alguém com conta Zuka para ajudar com pedidos e produtos.'
						: 'Quando o dono convidar pessoas, elas aparecem aqui.'}
				</EmptyDescription>
			</EmptyHeader>
			{canManage ? (
				<EmptyContent>
					<Button className='rounded-full' onClick={onInvite}>
						<UserPlus className='size-4' />
						Convidar membro
					</Button>
				</EmptyContent>
			) : null}
		</Empty>
	)
}
