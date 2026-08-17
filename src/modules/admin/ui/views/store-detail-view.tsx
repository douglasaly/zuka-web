'use client'
import { useStoreDetail } from '@/modules/admin/hooks/use-store-detail'
import { ConfirmDialog } from '../components/confirm-dialog'
import { StoreDetailActivity } from '../sections/store-detail-activity'
import { StoreDetailDanger } from '../sections/store-detail-danger'
import { StoreDetailHeader } from '../sections/store-detail-header'
import { StoreDetailInfo } from '../sections/store-detail-info'
import { StoreDetailLoading } from '../sections/store-detail-loading'
import { StoreDetailProducts } from '../sections/store-detail-products'
import { StoreDetailTabs } from '../sections/store-detail-tabs'
export function StoreDetailView({ id }: { id: string }) {
	const {
		tab,
		setTab,
		confirmAction,
		setConfirmAction,
		isLoading,
		store,
		docs,
		products,
		owner,
		province,
		patchMutation,
		deleteMutation,
	} = useStoreDetail(id)
	if (isLoading) {
		return <StoreDetailLoading />
	}
	if (!store) {
		return <p className='text-muted-foreground'>Loja não encontrada.</p>
	}
	return (
		<div className='space-y-6'>
			<StoreDetailHeader store={store} />

			<StoreDetailTabs tab={tab} onTabChange={setTab} />

			{tab === 'Informações' && (
				<StoreDetailInfo
					store={store}
					owner={owner}
					province={province}
					docs={docs}
				/>
			)}

			{tab === 'Produtos' && <StoreDetailProducts products={products} />}

			{tab === 'Atividade' && <StoreDetailActivity />}

			<StoreDetailDanger
				status={store.status as string}
				onSuspend={() => setConfirmAction('suspend')}
				onReactivate={() => patchMutation.mutate({ status: 'ACTIVE' })}
				onDelete={() => setConfirmAction('delete')}
			/>

			<ConfirmDialog
				open={confirmAction === 'suspend'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Suspender loja'
				description='A loja ficará invisível para compradores e os produtos serão ocultados.'
				confirmLabel='Suspender'
				loading={patchMutation.isPending}
				onConfirm={() => {
					patchMutation.mutate(
						{ status: 'SUSPENDED' },
						{ onSuccess: () => setConfirmAction(null) }
					)
				}}
			/>
			<ConfirmDialog
				open={confirmAction === 'delete'}
				onOpenChange={(v) => !v && setConfirmAction(null)}
				title='Eliminar loja permanentemente'
				description='Esta ação é irreversível. Todos os dados da loja serão eliminados.'
				confirmLabel='Eliminar'
				loading={deleteMutation.isPending}
				onConfirm={() => deleteMutation.mutate()}
			/>
		</div>
	)
}
