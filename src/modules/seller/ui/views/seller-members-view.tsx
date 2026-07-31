'use client'

/**
 * THESIS: Store team roster — see who can act, invite by email, remove safely.
 * OWN-WORLD: Seller Operate (rounded-2xl, meta, full-bleed mobile).
 * STORY: Scan owner + Equipe → convidar → alterar função ou remover.
 * FIRST VIEWPORT: Count + Convidar + lista.
 * FORM: Extension of seller dashboard; store_members + RBAC seed.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	Crown,
	Loader2,
	MoreHorizontal,
	UserPlus,
	Users,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { STORE_ROLE_UI } from '@/lib/auth/store-permissions'
import { cn } from '@/lib/utils'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'

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
	status: string
	joinedAt: string | null
	invitedAt: string | null
	user: MemberUser
}

type RoleCatalog = typeof STORE_ROLE_UI
type InviteRole = keyof RoleCatalog

type MembersResponse = {
	members: Member[]
	me?: {
		userId: string
		memberRole: string
		rbacRole: string
		isOwner: boolean
		permissions: string[]
		canManage: boolean
	}
	roleCatalog?: RoleCatalog
}

const ROLE_LABELS: Record<string, string> = {
	owner: 'Dono',
	manager: 'Gestor',
	staff: 'Colaborador',
	viewer: 'Visualizador',
}

const INVITE_ROLES = ['manager', 'staff', 'viewer'] as const

function displayName(user: MemberUser) {
	const name = [user.firstName, user.lastName].filter(Boolean).join(' ').trim()
	return name || user.email || 'Utilizador'
}

function initialsOf(user: MemberUser) {
	const parts = [user.firstName, user.lastName].filter(Boolean) as string[]
	if (parts.length > 0) {
		return parts
			.map((n) => n.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}
	return (user.email?.charAt(0) ?? '?').toUpperCase()
}

function formatJoined(iso: string | null) {
	if (!iso) return 'Convite pendente'
	return `Desde ${new Date(iso).toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})}`
}

export const SellerMembersView = () => {
	useSetSellerPageMeta({
		title: 'Membros',
		crumbs: ['Dashboard', 'Loja', 'Membros'],
	})

	const [inviteOpen, setInviteOpen] = useState(false)
	const [email, setEmail] = useState('')
	const [role, setRole] = useState<InviteRole>('staff')
	const [removing, setRemoving] = useState<Member | null>(null)
	const queryClient = useQueryClient()

	const { data, isLoading, isError, refetch, error } =
		useQuery<MembersResponse>({
			queryKey: ['seller-members'],
			queryFn: async () => {
				const res = await fetch('/api/seller/members')
				const body = await res.json().catch(() => ({}))
				if (!res.ok) {
					throw new Error(body.error ?? 'Failed to load members')
				}
				return body
			},
		})

	const inviteMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/seller/members', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: email.trim(), role }),
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(body.error ?? 'Failed to invite')
			return body
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			queryClient.invalidateQueries({ queryKey: ['seller-access'] })
			closeInvite()
			toast.success('Membro adicionado à loja.')
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Não foi possível convidar.')
		},
	})

	const removeMutation = useMutation({
		mutationFn: async (memberId: string) => {
			const res = await fetch(`/api/seller/members/${memberId}`, {
				method: 'DELETE',
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(body.error ?? 'Failed to remove')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			setRemoving(null)
			toast.success('Membro removido da loja.')
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Não foi possível remover.')
		},
	})

	const roleMutation = useMutation({
		mutationFn: async ({
			memberId,
			nextRole,
		}: {
			memberId: string
			nextRole: string
		}) => {
			const res = await fetch(`/api/seller/members/${memberId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role: nextRole }),
			})
			const body = await res.json().catch(() => ({}))
			if (!res.ok) throw new Error(body.error ?? 'Failed to update role')
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['seller-members'] })
			toast.success('Função actualizada.')
		},
		onError: (err: Error) => {
			toast.error(err.message || 'Não foi possível actualizar.')
		},
	})

	function closeInvite() {
		setInviteOpen(false)
		setEmail('')
		setRole('staff')
	}

	function openInvite() {
		setInviteOpen(true)
	}

	const members = data?.members ?? []
	const canManage = Boolean(data?.me?.canManage)
	const currentUserId = data?.me?.userId ?? null
	const roleCatalog = data?.roleCatalog ?? STORE_ROLE_UI
	const owner = members.find((m) => m.role === 'owner')
	const others = members.filter((m) => m.role !== 'owner')
	const inviteSummary = roleCatalog[role]?.summary
	const busy =
		removeMutation.isPending ||
		roleMutation.isPending ||
		inviteMutation.isPending

	const forbidden =
		isError &&
		error instanceof Error &&
		/permissão|Unauthorized|membro/i.test(error.message)

	if (isLoading) {
		return (
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

	if (isError) {
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
							onClick={() => refetch()}
						>
							Tentar novamente
						</Button>
					</EmptyContent>
				) : null}
			</Empty>
		)
	}

	return (
		<div className='w-full min-w-0 space-y-8 pb-10'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
				<p className='max-w-xl text-sm leading-relaxed text-muted-foreground'>
					{canManage
						? 'Aqui você vê quem pode gerenciar a loja contigo.'
						: 'Aqui você vê a equipe da loja.'}
				</p>
				<div className='flex flex-wrap items-center gap-3'>
					<p className='flex items-center gap-2 text-sm text-muted-foreground tabular-nums'>
						<Users className='size-4 shrink-0' aria-hidden />
						<span>
							{members.length === 1
								? '1 membro'
								: `${members.length} membros`}
						</span>
					</p>
					{canManage ? (
						<Button
							className='h-10 rounded-full px-4'
							onClick={openInvite}
						>
							<UserPlus className='size-4' />
							Convidar
						</Button>
					) : null}
				</div>
			</div>

			{owner ? (
				<section aria-labelledby='owner-heading' className='space-y-3'>
					<h2
						id='owner-heading'
						className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'
					>
						Dono
					</h2>
					<MemberRow
						member={owner}
						isSelf={
							Boolean(currentUserId) &&
							owner.user.id === currentUserId
						}
						emphasized
					/>
				</section>
			) : null}

			{others.length > 0 ? (
				<section aria-labelledby='team-heading' className='space-y-3'>
					<div className='flex items-baseline justify-between gap-3'>
						<h2
							id='team-heading'
							className='text-xs font-semibold tracking-wide text-muted-foreground uppercase'
						>
							Equipe
						</h2>
						<span className='text-xs text-muted-foreground tabular-nums'>
							{others.length}
						</span>
					</div>
					<ul className='space-y-2' role='list'>
						{others.map((member) => (
							<li key={member.id}>
								<MemberRow
									member={member}
									isSelf={
										Boolean(currentUserId) &&
										member.user.id === currentUserId
									}
									canManage={canManage}
									roleCatalog={roleCatalog}
									busy={busy}
									onRoleChange={(nextRole) =>
										roleMutation.mutate({
											memberId: member.id,
											nextRole,
										})
									}
									onRemove={() => setRemoving(member)}
								/>
							</li>
						))}
					</ul>
				</section>
			) : null}

			{members.length === 0 ? (
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
							<Button
								className='rounded-full'
								onClick={openInvite}
							>
								<UserPlus className='size-4' />
								Convidar membro
							</Button>
						</EmptyContent>
					) : null}
				</Empty>
			) : null}

			{owner && others.length === 0 && canManage ? (
				<p className='rounded-2xl border border-dashed border-border/70 bg-muted/15 px-4 py-3 text-sm text-muted-foreground'>
					Ainda és só tu. Convida um colaborador quando precisares de ajuda no dia a dia.
				</p>
			) : null}

			<Dialog
				open={inviteOpen && canManage}
				onOpenChange={(open) => {
					if (!open && !inviteMutation.isPending) closeInvite()
					else if (open) setInviteOpen(true)
				}}
			>
				<DialogContent className='rounded-2xl sm:max-w-md'>
					<DialogHeader>
						<DialogTitle className='font-heading text-lg font-bold'>
							Convidar membro
						</DialogTitle>
						<DialogDescription>
							A pessoa precisa de já ter uma conta no Zuka com o
							mesmo email.
						</DialogDescription>
					</DialogHeader>

					<div className='space-y-4'>
						<div className='space-y-2'>
							<Label htmlFor='invite-email'>Email</Label>
							<Input
								id='invite-email'
								type='email'
								autoComplete='email'
								inputMode='email'
								placeholder='ex.: ana@exemplo.com'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								onKeyDown={(e) => {
									if (
										e.key === 'Enter' &&
										email.trim() &&
										!inviteMutation.isPending
									) {
										inviteMutation.mutate()
									}
								}}
								className='h-11 rounded-full'
								disabled={inviteMutation.isPending}
								autoFocus
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='invite-role'>Função</Label>
							<Select
								value={role}
								onValueChange={(v) => {
									if (v && INVITE_ROLES.includes(v as InviteRole)) {
										setRole(v as InviteRole)
									}
								}}
								disabled={inviteMutation.isPending}
							>
								<SelectTrigger
									id='invite-role'
									className='h-11 rounded-full'
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{INVITE_ROLES.map((key) => (
										<SelectItem key={key} value={key}>
											{roleCatalog[key].label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{inviteSummary ? (
								<p className='text-xs leading-relaxed text-muted-foreground'>
									{inviteSummary}
								</p>
							) : null}
						</div>
					</div>

					<DialogFooter className='gap-2'>
						<Button
							variant='outline'
							className='rounded-full'
							onClick={closeInvite}
							disabled={inviteMutation.isPending}
						>
							Cancelar
						</Button>
						<Button
							className='rounded-full'
							onClick={() => inviteMutation.mutate()}
							disabled={
								!email.trim() || inviteMutation.isPending
							}
						>
							{inviteMutation.isPending ? (
								<>
									<Loader2 className='size-4 animate-spin' />
									A convidar…
								</>
							) : (
								<>
									<UserPlus className='size-4' />
									Convidar
								</>
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<AlertDialog
				open={Boolean(removing)}
				onOpenChange={(open) => {
					if (!open && !removeMutation.isPending) setRemoving(null)
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Remover{' '}
							{removing ? displayName(removing.user) : 'membro'}?
						</AlertDialogTitle>
						<AlertDialogDescription>
							Essa pessoa deixa de aceder ao painel desta loja.
							Podes convidá-la outra vez mais tarde.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel
							disabled={removeMutation.isPending}
							className='rounded-full'
						>
							Cancelar
						</AlertDialogCancel>
						<AlertDialogAction
							variant='destructive'
							className='rounded-full'
							disabled={removeMutation.isPending}
							onClick={(e) => {
								e.preventDefault()
								if (removing) {
									removeMutation.mutate(removing.id)
								}
							}}
						>
							{removeMutation.isPending ? (
								<>
									<Loader2 className='size-4 animate-spin' />
									A remover…
								</>
							) : (
								'Remover da Equipe'
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}

function MemberRow({
	member,
	isSelf,
	emphasized,
	canManage,
	roleCatalog,
	busy,
	onRemove,
	onRoleChange,
}: {
	member: Member
	isSelf?: boolean
	emphasized?: boolean
	canManage?: boolean
	roleCatalog?: RoleCatalog
	busy?: boolean
	onRemove?: () => void
	onRoleChange?: (role: string) => void
}) {
	const isOwner = member.role === 'owner'
	const fullName = displayName(member.user)
	const initials = initialsOf(member.user)
	const roleLabel = ROLE_LABELS[member.role] ?? member.role

	return (
		<article
			className={cn(
				'flex flex-col gap-3 rounded-2xl border bg-card p-4 transition-colors sm:flex-row sm:items-center sm:gap-4',
				emphasized
					? 'border-amber-500/25 shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
					: 'border-border/60',
				isSelf && !emphasized && 'bg-muted/25'
			)}
		>
			<div className='flex min-w-0 flex-1 items-center gap-3'>
				<Avatar size='lg' className='size-11'>
					{member.user.avatarUrl ? (
						<AvatarImage
							src={member.user.avatarUrl}
							alt={`Foto de ${fullName}`}
						/>
					) : null}
					<AvatarFallback className='text-xs font-medium'>
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className='min-w-0 flex-1'>
					<p className='truncate font-medium'>{fullName}</p>
					{member.user.email ? (
						<p className='truncate text-xs text-muted-foreground'>
							{member.user.email}
						</p>
					) : null}
					<p className='mt-0.5 text-xs text-muted-foreground'>
						{formatJoined(member.joinedAt)}
					</p>
				</div>
			</div>

			<div className='flex flex-wrap items-center gap-2 sm:justify-end'>
				{isOwner ? (
					<Badge
						variant='outline'
						className='h-7 gap-1.5 border-amber-500/30 bg-amber-500/10 px-2.5 text-amber-800 dark:text-amber-300'
					>
						<Crown
							className='size-3.5 text-amber-500'
							aria-hidden
						/>
						{isSelf ? 'Você' : 'Dono'}
					</Badge>
				) : isSelf ? (
					<Badge variant='secondary' className='h-7 px-2.5'>
						Você
					</Badge>
				) : !canManage ? (
					<Badge variant='secondary' className='h-7 px-2.5'>
						{roleLabel}
					</Badge>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant='outline'
									size='sm'
									className='h-9 gap-1.5 rounded-full'
									disabled={busy}
									aria-label={`Gerir ${fullName}`}
								/>
							}
						>
							{roleLabel}
							<MoreHorizontal className='size-4 opacity-60' />
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-52'>
							<DropdownMenuRadioGroup
								value={member.role}
								onValueChange={(v) => {
									if (v && v !== member.role) {
										onRoleChange?.(v)
									}
								}}
							>
								<DropdownMenuLabel>Função</DropdownMenuLabel>
								{(
									Object.keys(
										roleCatalog ?? STORE_ROLE_UI
									) as InviteRole[]
								).map((key) => (
									<DropdownMenuRadioItem
										key={key}
										value={key}
										disabled={busy}
									>
										{(roleCatalog ?? STORE_ROLE_UI)[key]
											.label}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								disabled={busy}
								onClick={() => onRemove?.()}
							>
								Remover da Equipe
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
		</article>
	)
}
