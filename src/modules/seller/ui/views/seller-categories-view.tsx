'use client'

import { useQuery } from '@tanstack/react-query'
import { FolderTree } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type Category = {
	id: string
	parentId: string | null
	name: string
	slug: string
}

export const SellerCategoriesView = () => {
	const { data: categories, isLoading } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			return res.json()
		},
	})

	if (isLoading) {
		return (
			<div className='space-y-3'>
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton key={i} className='h-12 w-full rounded-xl' />
				))}
			</div>
		)
	}

	const rootCategories = (categories ?? []).filter((c) => !c.parentId)
	const childCategories = (categories ?? []).filter((c) => c.parentId)

	const getChildren = (parentId: string) =>
		childCategories.filter((c) => c.parentId === parentId)

	const hasNoCategories =
		rootCategories.length === 0 && childCategories.length === 0

	if (hasNoCategories) {
		return (
			<div className='flex flex-col items-center justify-center py-24 text-center'>
				<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
					<FolderTree className='size-8 text-muted-foreground' />
				</div>
				<h2 className='mt-4 font-heading text-xl font-bold'>
					Nenhuma categoria
				</h2>
				<p className='mt-1 max-w-sm text-sm text-muted-foreground'>
					As categorias são geridas pelo administrador da plataforma.
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='font-heading text-xl font-bold'>Categorias</h1>
				<p className='text-sm text-muted-foreground'>
					{rootCategories.length + childCategories.length} categorias
					disponíveis para os seus produtos
				</p>
			</div>

			<div className='space-y-2'>
				{rootCategories.map((cat) => {
					const children = getChildren(cat.id)
					return (
						<div
							key={cat.id}
							className='rounded-xl border border-border/60 bg-card'
						>
							<div className='flex items-center gap-3 px-5 py-3.5'>
								<div className='flex size-8 items-center justify-center rounded-lg bg-primary/10'>
									<FolderTree className='size-4 text-primary' />
								</div>
								<div className='flex-1'>
									<p className='font-medium'>{cat.name}</p>
									{children.length > 0 && (
										<p className='text-xs text-muted-foreground'>
											{children.length}{' '}
											{children.length === 1
												? 'subcategoria'
												: 'subcategorias'}
										</p>
									)}
								</div>
								<span className='text-xs text-muted-foreground'>
									{cat.slug}
								</span>
							</div>
							{children.length > 0 && (
								<div className='border-t border-border/40 px-5 py-2'>
									{children.map((child) => (
										<div
											key={child.id}
											className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent/50'
										>
											<div className='size-1.5 rounded-full bg-muted-foreground/40' />
											<span>{child.name}</span>
											<span className='ml-auto text-xs text-muted-foreground'>
												{child.slug}
											</span>
										</div>
									))}
								</div>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
