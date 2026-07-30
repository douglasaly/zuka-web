'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type {
	SellerStoreDetail,
	UpdateSellerStoreInput,
} from '@/lib/types/api/seller'
import { LOCKED_STATUS_LABELS, STATUS_OPTIONS } from './constants'
import { StoreContactSection } from './store-contact-section'
import { StoreDeliverySection } from './store-delivery-section'
import { StoreDocumentsSection } from './store-documents-section'
import { StoreHeroPreview } from './store-hero-preview'
import { StoreIdentitySection } from './store-identity-section'
import { StoreLocationSection } from './store-location-section'
import { StoreMediaSection } from './store-media-section'
import { StoreStatusSection } from './store-status-section'
import { formatPhone, type StoreFormState, storeToFormState } from './types'

type StoreEditorFormProps = {
	store: SellerStoreDetail
}

export function StoreEditorForm({ store }: StoreEditorFormProps) {
	const queryClient = useQueryClient()
	const [form, setForm] = useState<StoreFormState>(() =>
		storeToFormState(store)
	)
	const [mediaUploading, setMediaUploading] = useState(false)

	useEffect(() => {
		setForm(storeToFormState(store))
	}, [store])

	const lockedStatus =
		store.status === 'ACTIVE' || store.status === 'INACTIVE'
			? null
			: store.status

	const statusLabel =
		LOCKED_STATUS_LABELS[store.status] ??
		STATUS_OPTIONS.find((o) => o.value === form.status)?.label ??
		store.status

	function patchForm(patch: Partial<StoreFormState>) {
		setForm((prev) => ({ ...prev, ...patch }))
	}

	const mutation = useMutation({
		mutationFn: async () => {
			if (!form.name.trim()) {
				throw new Error('O nome da loja é obrigatório')
			}
			if (!form.slug.trim()) {
				throw new Error('O slug é obrigatório')
			}

			const payload: UpdateSellerStoreInput = {
				name: form.name.trim(),
				slug: form.slug.trim(),
				description: form.description.trim() || null,
				phone: formatPhone(form.phone) || null,
				whatsapp: formatPhone(form.whatsapp) || null,
				email: form.email.trim() || null,
				provinceId: form.provinceId || null,
				neighborhood: form.neighborhood.trim(),
				hasDelivery: form.hasDelivery,
				deliveryFee: form.hasDelivery
					? form.deliveryFee
						? Number(form.deliveryFee)
						: null
					: null,
				deliveryEtaMinutes: form.hasDelivery
					? form.deliveryEtaMinutes
						? Number(form.deliveryEtaMinutes)
						: null
					: null,
				deliveryZones: form.hasDelivery ? form.deliveryZones : [],
			}

			// Só envia media quando mudou (mantém link actual se não alterado)
			if (form.logoUrl !== store.logoUrl) {
				payload.logoUrl = form.logoUrl
			}
			if (form.bannerUrl !== store.bannerUrl) {
				payload.bannerUrl = form.bannerUrl
			}

			if (!lockedStatus) {
				payload.status = form.status
			}

			const res = await fetch('/api/seller/store', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})
			const json = await res.json()
			if (!res.ok) {
				throw new Error(json.error ?? 'Erro ao guardar a loja')
			}
			return json.store as SellerStoreDetail
		},
		onSuccess: (updated) => {
			toast.success('Loja actualizada')
			queryClient.setQueryData(['seller-store'], {
				success: true,
				store: updated,
			})
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
		},
		onError: (error: Error) => toast.error(error.message),
	})

	return (
		<div className='space-y-6 pb-24'>
			<div className='flex flex-wrap items-start justify-between gap-3'>
				<div>
					<p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
						Minha Loja
					</p>
					<h1 className='mt-1 font-heading text-2xl font-bold tracking-tight'>
						Perfil da loja
					</h1>
					<p className='mt-1 text-sm text-muted-foreground'>
						{store.productCount} produto
						{store.productCount === 1 ? '' : 's'} · Edite a
						aparência e os dados públicos
					</p>
				</div>
				<Button
					variant='outline'
					size='sm'
					className='rounded-full'
					render={
						<Link
							href={`/lojas/${store.slug}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<span className='inline-flex items-center gap-1.5'>
								<ExternalLink className='size-3.5' />
								Ver como comprador
							</span>
						</Link>
					}
				/>
			</div>

			<StoreHeroPreview
				form={form}
				verified={Boolean(store.verifiedAt)}
				statusLabel={statusLabel}
			/>

			<div className='grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
				<div className='space-y-6'>
					<StoreMediaSection
						form={form}
						onChange={patchForm}
						onUploadingChange={setMediaUploading}
					/>
					<StoreIdentitySection form={form} onChange={patchForm} />
					<StoreContactSection form={form} onChange={patchForm} />
				</div>
				<div className='space-y-6'>
					<StoreLocationSection form={form} onChange={patchForm} />
					<StoreDeliverySection form={form} onChange={patchForm} />
					<StoreStatusSection
						form={form}
						lockedStatus={lockedStatus}
						onChange={patchForm}
					/>
					<StoreDocumentsSection
						documents={store.documents}
						verifiedAt={store.verifiedAt}
					/>
				</div>
			</div>

			<div className='fixed inset-x-0 bottom-0 z-20 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:left-(--sidebar-width) md:peer-data-[collapsible=icon]/sidebar:left-(--sidebar-width-icon)'>
				<div className='mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6'>
					<p className='hidden text-xs text-muted-foreground sm:block'>
						{mediaUploading
							? 'Aguarde o carregamento das imagens...'
							: 'As alterações só são aplicadas ao guardar.'}
					</p>
					<Button
						type='button'
						className='rounded-full'
						disabled={mutation.isPending || mediaUploading}
						onClick={() => mutation.mutate()}
					>
						{mutation.isPending ? (
							<>
								<Loader2 className='size-4 animate-spin' />A
								guardar...
							</>
						) : mediaUploading ? (
							<>
								<Loader2 className='size-4 animate-spin' />A
								carregar imagem...
							</>
						) : (
							<>
								<Save className='size-4' />
								Guardar alterações
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	)
}
