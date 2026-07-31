'use client'

/**
 * THESIS: Store profile as a live shopfront editor — hero proves the look,
 * sections group identity / ops / trust; refuses duplicate page titles and
 * a save bar that overflows mobile.
 * OWN-WORLD: Seller dashboard Operate grammar (rounded-2xl sections, sticky save).
 * STORY: Preview → edit media/identity → location/delivery → status → save.
 * FIRST VIEWPORT: Compact chrome + live hero.
 * FORM: Extend product-editor Operate surface.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ExternalLink, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type {
	SellerStoreDetail,
	UpdateSellerStoreInput,
} from '@/lib/types/api/seller'
import { useSellerAccess } from '@/modules/seller/hooks/use-seller-access'
import { useSetSellerPageMeta } from '../../layouts/seller-page-meta'
import { LOCKED_STATUS_LABELS, STATUS_OPTIONS } from './constants'
import { StoreContactSection } from './store-contact-section'
import { StoreDeliverySection } from './store-delivery-section'
import { StoreDocumentsSection } from './store-documents-section'
import { StoreHeroPreview } from './store-hero-preview'
import { StoreIdentitySection } from './store-identity-section'
import { StoreLocationSection } from './store-location-section'
import { StoreMediaSection } from './store-media-section'
import { StoreStatusSection } from './store-status-section'
import {
	formatPhone,
	type StoreFormState,
	storeToFormState,
} from './types'

type StoreEditorFormProps = {
	store: SellerStoreDetail
}

function formsEqual(a: StoreFormState, b: StoreFormState) {
	return (
		a.name === b.name &&
		a.slug === b.slug &&
		a.description === b.description &&
		a.logoUrl === b.logoUrl &&
		a.bannerUrl === b.bannerUrl &&
		a.phone === b.phone &&
		a.whatsapp === b.whatsapp &&
		a.email === b.email &&
		a.provinceId === b.provinceId &&
		a.neighborhood === b.neighborhood &&
		a.status === b.status &&
		a.hasDelivery === b.hasDelivery &&
		a.deliveryFee === b.deliveryFee &&
		a.deliveryEtaMinutes === b.deliveryEtaMinutes &&
		a.deliveryZones.length === b.deliveryZones.length &&
		a.deliveryZones.every((z, i) => z === b.deliveryZones[i])
	)
}

export function StoreEditorForm({ store }: StoreEditorFormProps) {
	const queryClient = useQueryClient()
	const { can } = useSellerAccess()
	const canUpdate = can('store.update')
	const [form, setForm] = useState<StoreFormState>(() =>
		storeToFormState(store)
	)
	const [mediaUploading, setMediaUploading] = useState(false)

	useSetSellerPageMeta({
		title: 'Minha Loja',
		crumbs: ['Dashboard', 'Minha Loja'],
	})

	useEffect(() => {
		setForm(storeToFormState(store))
	}, [store])

	const baseline = useMemo(() => storeToFormState(store), [store])
	const isDirty = !formsEqual(form, baseline)

	const lockedStatus =
		store.status === 'ACTIVE' || store.status === 'INACTIVE'
			? null
			: store.status

	const statusLabel =
		LOCKED_STATUS_LABELS[store.status] ??
		STATUS_OPTIONS.find((o) => o.value === form.status)?.label ??
		store.status

	function patchForm(patch: Partial<StoreFormState>) {
		if (!canUpdate) return
		setForm((prev) => ({ ...prev, ...patch }))
	}

	const mutation = useMutation({
		mutationFn: async () => {
			if (!canUpdate) {
				throw new Error('Não tem permissão para editar a loja.')
			}
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

	const canSave =
		canUpdate && isDirty && !mutation.isPending && !mediaUploading

	return (
		<div className='min-w-0 max-w-full space-y-6 pb-28'>
			<div className='flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-3'>
				<p className='min-w-0 flex-1 text-sm leading-snug text-muted-foreground'>
					{!canUpdate
						? 'Modo consulta — só o dono ou um gestor com permissão pode editar a loja.'
						: isDirty
							? 'Tem alterações por guardar.'
							: 'Aparência e dados públicos da sua loja.'}
				</p>
				<Button
					variant='outline'
					size='sm'
					className='shrink-0 rounded-full'
					render={
						<Link
							href={`/lojas/${form.slug || store.slug}`}
							target='_blank'
							rel='noopener noreferrer'
						>
							<span className='inline-flex items-center gap-1.5'>
								<ExternalLink className='size-3.5' />
								<span className='hidden sm:inline'>
									Ver como comprador
								</span>
								<span className='sm:hidden'>Ver loja</span>
							</span>
						</Link>
					}
				/>
			</div>

			<StoreHeroPreview
				form={form}
				verified={Boolean(store.verifiedAt)}
				statusLabel={statusLabel}
				productCount={store.productCount}
			/>

			<div className='grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]'>
				<div className='min-w-0 space-y-6'>
					<StoreMediaSection
						form={form}
						onChange={patchForm}
						onUploadingChange={setMediaUploading}
					/>
					<StoreIdentitySection form={form} onChange={patchForm} />
					<StoreContactSection form={form} onChange={patchForm} />
				</div>
				<div className='min-w-0 space-y-6'>
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

			{canUpdate ? (
				<div className='fixed bottom-0 left-0 right-0 z-20 max-w-full border-t border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:left-(--sidebar-width)'>
					<div className='mx-auto flex w-full max-w-6xl min-w-0 flex-wrap items-center justify-end gap-2 px-4 py-3 sm:justify-between sm:gap-3 sm:px-6'>
						<p className='hidden min-w-0 flex-1 text-xs text-muted-foreground sm:block'>
							{mediaUploading
								? 'Aguarde o carregamento das imagens…'
								: isDirty
									? 'As alterações só são aplicadas ao guardar.'
									: 'Nenhuma alteração por guardar.'}
						</p>
						<Button
							type='button'
							size='sm'
							className='shrink-0 rounded-full'
							disabled={!canSave}
							onClick={() => mutation.mutate()}
						>
							{mutation.isPending ? (
								<>
									<Loader2 className='size-4 animate-spin' />
									A guardar…
								</>
							) : mediaUploading ? (
								<>
									<Loader2 className='size-4 animate-spin' />
									A carregar…
								</>
							) : (
								<>
									<Save className='size-4' />
									Guardar
								</>
							)}
						</Button>
					</div>
				</div>
			) : null}
		</div>
	)
}
