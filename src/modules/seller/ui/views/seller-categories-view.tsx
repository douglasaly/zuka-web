'use client'

/**
 * THESIS: Category tree as a living shelf index — monograms mark each shelf,
 * children hang on a rail, edit panel previews the slug; refuses flat muted
 * rows and a dashed empty box as the whole idea.
 * OWN-WORLD: Seller Operate (font-heading, rounded-2xl, restrained neutrals).
 * STORY: Scan shelves → reorder → open editor → save.
 * FIRST VIEWPORT: Intro strip + search + tree peak beside editor.
 * FORM: Amplify products/settings grammar already in the dashboard.
 */

import { useSellerCategories } from '@/modules/seller/hooks/use-seller-categories'
import { CategoryFormPanel } from '@/modules/seller/ui/components/categories/category-form-panel'
import { DeleteCategoryDialog } from '@/modules/seller/ui/components/categories/delete-category-dialog'
import { useSetSellerPageMeta } from '@/modules/seller/ui/layouts/seller-page-meta'
import {
	SellerCategoriesEmpty,
	SellerCategoriesError,
	SellerCategoriesSkeleton,
} from '@/modules/seller/ui/sections/seller-categories-empty'
import { SellerCategoriesToolbar } from '@/modules/seller/ui/sections/seller-categories-toolbar'
import { SellerCategoriesWorkspace } from '@/modules/seller/ui/sections/seller-categories-workspace'

export const SellerCategoriesView = () => {
	useSetSellerPageMeta({
		title: 'Categorias',
		crumbs: ['Dashboard', 'Produtos', 'Categorias'],
	})

	const c = useSellerCategories()

	if (c.isLoading) return <SellerCategoriesSkeleton />
	if (c.isError) return <SellerCategoriesError onRetry={() => c.refetch()} />

	return (
		<div className='min-w-0 max-w-6xl space-y-6 pb-10'>
			<SellerCategoriesToolbar
				totalCount={c.categories.length}
				rootCount={c.roots.length}
				subCount={c.subCount}
				onCreate={c.openCreate}
			/>

			{c.categories.length === 0 ? (
				<SellerCategoriesEmpty onCreate={c.openCreate} />
			) : (
				<SellerCategoriesWorkspace
					query={c.query}
					onQueryChange={c.setQuery}
					onClearQuery={() => c.setQuery('')}
					form={c.form}
					roots={c.roots}
					visibleRoots={c.visibleRoots}
					isFiltering={c.isFiltering}
					childrenOf={c.childrenOf}
					savePending={c.saveMutation.isPending}
					onFormChange={c.setForm}
					onSave={() => c.saveMutation.mutate()}
					onCancelForm={() => c.setForm(null)}
					onCreate={c.openCreate}
					onMove={c.move}
					onEdit={c.openEdit}
					onDelete={c.setDeleteTarget}
				/>
			)}

			{c.categories.length === 0 && c.form ? (
				<div className='mx-auto max-w-md animate-in fade-in-0 duration-200'>
					<CategoryFormPanel
						form={c.form}
						roots={c.roots}
						pending={c.saveMutation.isPending}
						onChange={c.setForm}
						onSave={() => c.saveMutation.mutate()}
						onCancel={() => c.setForm(null)}
					/>
				</div>
			) : null}

			<DeleteCategoryDialog
				target={c.deleteTarget}
				pending={c.deleteMutation.isPending}
				onOpenChange={(open) => {
					if (!open) c.clearDeleteTarget()
				}}
				onConfirm={c.confirmDelete}
			/>
		</div>
	)
}
