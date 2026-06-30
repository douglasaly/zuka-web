'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { hasAdminAccess } from '@/lib/auth/roles'
import { ConfirmDialog } from '../components/confirm-dialog'

type Category = { id: string; name: string; slug: string }

async function fetchCategories() {
	const res = await fetch('/api/admin/categories', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	return res.json()
}

async function fetchAdmins() {
	const res = await fetch('/api/admin/users', { credentials: 'include' })
	if (!res.ok) throw new Error('Failed')
	const data = await res.json()
	return {
		users: (data.users ?? []).filter((u: Record<string, unknown>) =>
			hasAdminAccess((u.roles as string[]) ?? [])
		),
	}
}

export function SettingsView() {
	const qc = useQueryClient()

	// Categories
	const [newCatName, setNewCatName] = useState('')
	const [editingCat, setEditingCat] = useState<{
		id: string
		name: string
	} | null>(null)
	const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(
		null
	)

	const { data: catData, isLoading: catsLoading } = useQuery({
		queryKey: ['admin-categories'],
		queryFn: fetchCategories,
	})
	const { data: adminsData, isLoading: adminsLoading } = useQuery({
		queryKey: ['admin-admins'],
		queryFn: fetchAdmins,
	})

	const cats: Category[] = catData?.categories ?? []
	const admins: Record<string, unknown>[] = adminsData?.users ?? []

	const addCatMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/admin/categories', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: newCatName }),
			})
			if (!res.ok) throw new Error('Failed')
			return res.json()
		},
		onSuccess: () => {
			toast.success('Categoria adicionada')
			setNewCatName('')
			qc.invalidateQueries({ queryKey: ['admin-categories'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const editCatMutation = useMutation({
		mutationFn: async ({ id, name }: { id: string; name: string }) => {
			const res = await fetch('/api/admin/categories', {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id, name }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			toast.success('Categoria atualizada')
			setEditingCat(null)
			qc.invalidateQueries({ queryKey: ['admin-categories'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const deleteCatMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch('/api/admin/categories', {
				method: 'DELETE',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			toast.success('Categoria eliminada')
			setConfirmDeleteCat(null)
			qc.invalidateQueries({ queryKey: ['admin-categories'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	const removeAdminMutation = useMutation({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/admin/users/${id}`, {
				method: 'PATCH',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ removeAdmin: true }),
			})
			if (!res.ok) throw new Error('Failed')
		},
		onSuccess: () => {
			toast.success('Função admin removida')
			qc.invalidateQueries({ queryKey: ['admin-admins'] })
		},
		onError: () => toast.error('Ocorreu um erro'),
	})

	return (
		<div className='max-w-2xl space-y-8'>
			{/* Categories */}
			<section className='space-y-3'>
				<div>
					<p className='font-heading font-bold'>Categorias</p>
					<p className='text-sm text-muted-foreground'>
						Gerir as categorias de produtos e lojas
					</p>
				</div>

				{/* Add new */}
				<form
					className='flex gap-2'
					onSubmit={(e) => {
						e.preventDefault()
						if (newCatName.trim()) addCatMutation.mutate()
					}}
				>
					<Input
						value={newCatName}
						onChange={(e) => setNewCatName(e.target.value)}
						placeholder='Nome da nova categoria...'
						className='flex-1'
					/>
					<Button
						type='submit'
						disabled={
							!newCatName.trim() || addCatMutation.isPending
						}
					>
						<Plus className='size-4' />
						Adicionar
					</Button>
				</form>

				{catsLoading ? (
					<div className='space-y-2'>
						{Array.from({ length: 5 }, (_, i) => (
							<Skeleton key={i} className='h-12 rounded-xl' />
						))}
					</div>
				) : (
					<div className='rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40'>
						{cats.length === 0 && (
							<p className='py-8 text-center text-sm text-muted-foreground'>
								Sem categorias.
							</p>
						)}
						{cats.map((cat) => (
							<div
								key={cat.id}
								className='flex items-center justify-between gap-2 px-4 py-2.5'
							>
								{editingCat?.id === cat.id ? (
									<>
										<Input
											value={editingCat.name}
											onChange={(e) =>
												setEditingCat({
													...editingCat,
													name: e.target.value,
												})
											}
											className='flex-1 h-8 text-sm'
											autoFocus
										/>
										<div className='flex gap-1'>
											<Button
												size='sm'
												variant='ghost'
												type='button'
												className='text-emerald-600'
												onClick={() =>
													editCatMutation.mutate({
														id: editingCat.id,
														name: editingCat.name,
													})
												}
												disabled={
													editCatMutation.isPending
												}
											>
												<Check className='size-3.5' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												type='button'
												onClick={() =>
													setEditingCat(null)
												}
											>
												<X className='size-3.5' />
											</Button>
										</div>
									</>
								) : (
									<>
										<span className='text-sm font-medium flex-1'>
											{cat.name}
										</span>
										<span className='text-xs text-muted-foreground'>
											{cat.slug}
										</span>
										<div className='flex gap-1'>
											<Button
												size='sm'
												variant='ghost'
												type='button'
												onClick={() =>
													setEditingCat({
														id: cat.id,
														name: cat.name,
													})
												}
											>
												<Pencil className='size-3.5' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												type='button'
												className='text-destructive'
												onClick={() =>
													setConfirmDeleteCat(cat.id)
												}
											>
												<Trash2 className='size-3.5' />
											</Button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</section>

			{/* Admin accounts */}
			<section className='space-y-3'>
				<div>
					<p className='font-heading font-bold'>Contas admin</p>
					<p className='text-sm text-muted-foreground'>
						Utilizadores com acesso ao painel de administração
					</p>
				</div>

				{adminsLoading ? (
					<div className='space-y-2'>
						{Array.from({ length: 2 }, (_, i) => (
							<Skeleton key={i} className='h-12 rounded-xl' />
						))}
					</div>
				) : (
					<div className='rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40'>
						{admins.length === 0 && (
							<p className='py-8 text-center text-sm text-muted-foreground'>
								Sem admins.
							</p>
						)}
						{admins.map((user) => {
							const roles = (user.roles as string[]) ?? []
							const hasAdminRole = roles.includes('admin')
							return (
								<div
									key={user.id as string}
									className='flex items-center justify-between gap-2 px-4 py-2.5'
								>
									<div className='flex items-center gap-2'>
										{user.avatar_url ? (
											<img
												src={user.avatar_url as string}
												alt=''
												className='size-7 rounded-full object-cover'
											/>
										) : (
											<div className='flex size-7 items-center justify-center rounded-full bg-muted text-xs font-bold uppercase'>
												{(
													user.first_name as string
												)?.[0] ?? '?'}
											</div>
										)}
										<div>
											<p className='text-sm font-medium'>
												{`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
											</p>
											<p className='text-xs text-muted-foreground'>
												{user.email as string}
											</p>
										</div>
									</div>
									{hasAdminRole && (
										<Button
											size='sm'
											variant='outline'
											type='button'
											className='text-muted-foreground'
											onClick={() =>
												removeAdminMutation.mutate(
													user.id as string
												)
											}
											disabled={
												removeAdminMutation.isPending
											}
										>
											Remover admin
										</Button>
									)}
								</div>
							)
						})}
					</div>
				)}
			</section>

			<ConfirmDialog
				open={Boolean(confirmDeleteCat)}
				onOpenChange={(v) => !v && setConfirmDeleteCat(null)}
				title='Eliminar categoria'
				description='Os produtos associados a esta categoria poderão ficar sem categoria. Esta ação não pode ser desfeita.'
				confirmLabel='Eliminar'
				loading={deleteCatMutation.isPending}
				onConfirm={() =>
					confirmDeleteCat &&
					deleteCatMutation.mutate(confirmDeleteCat)
				}
			/>
		</div>
	)
}
