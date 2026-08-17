'use client'
import { Loader2, X } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slug } from '@/utils/slug'
import type { Category, CategoryForm } from './types'
import { monogram } from './utils'
export function CategoryFormPanel({
	form,
	roots,
	pending,
	onChange,
	onSave,
	onCancel,
}: {
	form: CategoryForm
	roots: Category[]
	pending: boolean
	onChange: (next: CategoryForm) => void
	onSave: () => void
	onCancel: () => void
}) {
	const isEdit = Boolean(form.id)
	const canSave = form.name.trim().length > 0 && !pending
	const slugPreview = form.slug.trim() || Slug(form.name) || 'slug'
	return (
		<section className='min-w-0 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]'>
			<div className='flex items-start gap-3 border-b border-border/50 bg-muted/30 px-4 py-4 sm:px-5'>
				<span className='flex size-11 shrink-0 items-center justify-center rounded-2xl bg-foreground font-heading text-lg font-bold text-background'>
					{monogram(form.name || 'C')}
				</span>
				<div className='min-w-0 flex-1'>
					<h2 className='font-heading text-base font-bold tracking-tight'>
						{isEdit ? 'Editar categoria' : 'Nova categoria'}
					</h2>
					<p className='mt-0.5 text-xs text-muted-foreground'>
						{isEdit
							? 'Actualize como aparece nos produtos.'
							: 'Defina o nome e onde vive na árvore.'}
					</p>
				</div>
				<IconTooltipButton label='Fechar formulário' onClick={onCancel}>
					<X className='size-4' />
				</IconTooltipButton>
			</div>

			<div className='space-y-4 p-4 sm:p-5'>
				<div className='space-y-2'>
					<Label htmlFor='cat-name'>Nome</Label>
					<Input
						id='cat-name'
						value={form.name}
						onChange={(e) => {
							const name = e.target.value
							onChange({
								...form,
								name,
								slug: form.id ? form.slug : Slug(name),
							})
						}}
						placeholder='Ex: Electrónica'
						className='h-11'
						autoFocus
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='cat-slug'>Slug</Label>
					<div className='flex min-w-0 overflow-hidden rounded-xl border border-input bg-background'>
						<span className='flex shrink-0 items-center bg-muted/60 px-2.5 font-mono text-[11px] text-muted-foreground sm:px-3 sm:text-xs'>
							/
						</span>
						<Input
							id='cat-slug'
							value={form.slug}
							onChange={(e) =>
								onChange({
									...form,
									slug: Slug(e.target.value),
								})
							}
							placeholder='electronica'
							className='h-11 min-w-0 rounded-none border-0 font-mono text-sm shadow-none focus-visible:ring-0'
						/>
					</div>
					<p className='text-xs text-muted-foreground'>
						Pré-visualização:{' '}
						<span className='font-mono text-foreground/80'>
							/{slugPreview}
						</span>
					</p>
				</div>

				<div className='space-y-2'>
					<Label>Categoria pai</Label>
					<Select
						value={form.parentId || 'none'}
						onValueChange={(value) =>
							value &&
							onChange({
								...form,
								parentId: value === 'none' ? '' : value,
							})
						}
					>
						<SelectTrigger className='h-11 w-full'>
							<SelectValue placeholder='Nenhuma (raiz)' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='none'>
								Nenhuma — categoria raiz
							</SelectItem>
							{roots
								.filter((c) => c.id !== form.id)
								.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='flex flex-wrap gap-2 border-t border-border/50 px-4 py-3.5 sm:px-5'>
				<Button
					className='rounded-full'
					disabled={!canSave}
					onClick={onSave}
				>
					{pending ? (
						<>
							<Loader2 className='size-4 animate-spin' />A
							guardar…
						</>
					) : isEdit ? (
						'Guardar alterações'
					) : (
						'Criar categoria'
					)}
				</Button>
				<Button
					variant='ghost'
					className='rounded-full'
					onClick={onCancel}
					disabled={pending}
				>
					Cancelar
				</Button>
			</div>
		</section>
	)
}
