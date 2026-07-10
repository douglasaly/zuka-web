'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, Plus, UserPlus, Users, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'

type MemberUser = {
	id: string
	firstName: string | null
	lastName: string | null
	email: string | null
	avatarUrl: string | null
}

type Member = {
	id: string
	role: string
	joinedAt: string | null
	invitedAt: string | null
	user: MemberUser
}

const ROLE_LABELS: Record<string, string> = {
	owner: 'Dono',
	manager: 'Gestor',
	staff: 'Colaborador',
	viewer: 'Visualizador',
}

const ROLE_COLORS: Record<string, string> = {
	owner: 'bg-purple-500/10 text-purple-600',
	manager: 'bg-blue-500/10 text-blue-600',
	staff: 'bg-emerald-500/10 text-emerald-600',
	viewer: 'bg-muted text-muted-foreground',
}

export const SellerMembersView = () => {
	const [showInvite, setShowInvite] = useState(false)
	const [email, setEmail] = useState('')
	const [role, setRole] = useState('staff')
	const queryClient = useQueryClient()

	const { data, isLoading } = useQuery<{ members: Member[] }>({
		queryKey: ['seller-members'],
		queryFn: async () => {
			const res = await fetch('/api/seller/members')
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error ?? 'Failed to load members')
			}
			return res.json()
		},
	})

	const inviteMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/seller/members', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, role }),
			})
			if (!res.ok) {
				const body = await res.json().catch(() => ({}))
				throw new Error(body.error ?? 'Failed to invite')
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			setShowInvite(false)
			setEmail('')
			setRole('staff')
		},
	})

	const members = data?.members ?? []
	const owner = members.find((m) => m.role === 'owner')
	const others = members.filter((m) => m.role !== 'owner')

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4'
					>
						<Skeleton className='size-10 rounded-full' />
						<div className='flex-1 space-y-1'>
							<Skeleton className='h-4 w-32' />
							<Skeleton className='h-3 w-20' />
						</div>
					</div>
				))}
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Users className='size-5 text-muted-foreground' />
					<p className='text-sm text-muted-foreground'>
						{members.length}{' '}
						{members.length === 1 ? 'membro' : 'membros'}
					</p>
				</div>
				<Button
					className='rounded-full'
					onClick={() => setShowInvite(true)}
				>
					<UserPlus className='mr-1 size-4' />
					Convidar
				</Button>
			</div>

			{owner && (
				<section>
					<h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Dono
					</h3>
					<MemberCard member={owner} />
				</section>
			)}

			{others.length > 0 && (
				<section>
					<h3 className='mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
						Equipa
					</h3>
					<div className='space-y-2'>
						{others.map((member) => (
							<MemberCard key={member.id} member={member} />
						))}
					</div>
				</section>
			)}

			{members.length === 0 && (
				<div className='flex flex-col items-center justify-center py-16 text-center'>
					<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
						<Users className='size-8 text-muted-foreground' />
					</div>
					<h2 className='mt-4 font-heading text-xl font-bold'>
						Nenhum membro
					</h2>
					<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
						Convide colaboradores para gerir a sua loja.
					</p>
					<Button
						className='mt-6 rounded-full'
						onClick={() => setShowInvite(true)}
					>
						<UserPlus className='mr-1 size-4' />
						Convidar membro
					</Button>
				</div>
			)}

			{showInvite && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
					<div className='mx-4 w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg'>
						<div className='flex items-center justify-between'>
							<h3 className='font-heading text-lg font-bold'>
								Convidar membro
							</h3>
							<button
								type='button'
								onClick={() => setShowInvite(false)}
								className='text-muted-foreground hover:text-foreground'
							>
								<X className='size-5' />
							</button>
						</div>

						<div className='mt-4 space-y-4'>
							<div>
								<label className='mb-1 block text-sm font-medium text-muted-foreground'>
									Email do Utilizador
								</label>
								<Input
									type='email'
									placeholder='email@exemplo.com'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div>
								<label className='mb-1 block text-sm font-medium text-muted-foreground'>
									Função
								</label>
								<Select
									value={role}
									onValueChange={(v) => v && setRole(v)}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='manager'>
											Gestor
										</SelectItem>
										<SelectItem value='staff'>
											Colaborador
										</SelectItem>
										<SelectItem value='viewer'>
											Visualizador
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className='mt-6 flex justify-end gap-2'>
							<Button
								variant='outline'
								size='sm'
								className='rounded-full'
								onClick={() => setShowInvite(false)}
							>
								Cancelar
							</Button>
							<Button
								size='sm'
								className='rounded-full'
								onClick={() => inviteMutation.mutate()}
								disabled={!email || inviteMutation.isPending}
							>
								{inviteMutation.isPending
									? 'A convidar…'
									: 'Convidar'}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

function MemberCard({ member }: { member: Member }) {
	const initials = [
		member.user.firstName?.charAt(0),
		member.user.lastName?.charAt(0),
	]
		.filter(Boolean)
		.join('')
		.toUpperCase()

	return (
		<div className='flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4'>
			<div className='relative size-10 shrink-0 overflow-hidden rounded-full bg-muted'>
				{member.user.avatarUrl ? (
					<Image
						src={member.user.avatarUrl}
						alt={`${member.user.firstName ?? ''} ${member.user.lastName ?? ''}`}
						fill
						className='object-cover'
						sizes='40px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
					/>
				) : (
					<div className='flex size-full items-center justify-center text-sm font-medium text-muted-foreground'>
						{initials || <Mail className='size-4' />}
					</div>
				)}
			</div>
			<div className='flex-1 min-w-0'>
				<p className='truncate font-medium'>
					{member.user.firstName || member.user.email || 'Utilizador'}
					{member.user.lastName && ` ${member.user.lastName}`}
				</p>
				{member.user.email && (
					<p className='truncate text-xs text-muted-foreground'>
						{member.user.email}
					</p>
				)}
			</div>
			<span
				className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[member.role] ?? 'bg-muted text-muted-foreground'}`}
			>
				{ROLE_LABELS[member.role] ?? member.role}
			</span>
		</div>
	)
}
