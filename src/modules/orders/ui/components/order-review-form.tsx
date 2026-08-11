'use client'

import { CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PRODUCT_PLACEHOLDER } from '@/lib/api/marketplace'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import type { BuyerOrderItem } from '@/modules/orders/types'
import { StarRatingInput } from './star-rating-input'

type OrderReviewFormProps = {
	orderId: string
	storeName: string
	items: BuyerOrderItem[]
	onSubmitted: () => void
}

type ProductDraft = {
	rating: number
	body: string
}

export function OrderReviewForm({
	orderId,
	storeName,
	items,
	onSubmitted,
}: OrderReviewFormProps) {
	const reviewableItems = useMemo(
		() => items.filter((item) => Boolean(item.productId)),
		[items]
	)

	const [storeRating, setStoreRating] = useState(0)
	const [storeBody, setStoreBody] = useState('')
	const [productDrafts, setProductDrafts] = useState<
		Record<string, ProductDraft>
	>(() =>
		Object.fromEntries(
			reviewableItems.map((item) => [
				item.productId!,
				{ rating: 0, body: '' },
			])
		)
	)
	const [storeError, setStoreError] = useState<string | null>(null)
	const [productErrors, setProductErrors] = useState<Record<string, string>>(
		{}
	)
	const [pending, setPending] = useState(false)
	const [done, setDone] = useState(false)

	function updateProduct(productId: string, patch: Partial<ProductDraft>) {
		setProductDrafts((prev) => ({
			...prev,
			[productId]: {
				rating: prev[productId]?.rating ?? 0,
				body: prev[productId]?.body ?? '',
				...patch,
			},
		}))
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (pending) return

		const nextStoreError =
			storeRating < 1 ? 'Escolhe uma nota para a loja.' : null
		const nextProductErrors: Record<string, string> = {}

		for (const item of reviewableItems) {
			const productId = item.productId!
			const draft = productDrafts[productId]
			if (!draft || draft.rating < 1) {
				nextProductErrors[productId] =
					'Escolhe uma nota para este produto.'
			}
		}

		setStoreError(nextStoreError)
		setProductErrors(nextProductErrors)

		if (nextStoreError || Object.keys(nextProductErrors).length > 0) {
			toast.error('Completa as notas antes de enviar.')
			return
		}

		setPending(true)
		try {
			const res = await fetch(`/api/orders/${orderId}/review`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({
					storeRating,
					storeBody: storeBody.trim() || null,
					products: reviewableItems.map((item) => {
						const draft = productDrafts[item.productId!]!
						return {
							productId: item.productId,
							rating: draft.rating,
							body: draft.body.trim() || null,
						}
					}),
				}),
			})
			const json = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error(
					typeof json.error === 'string'
						? json.error
						: 'Não foi possível enviar a avaliação.'
				)
			}

			setDone(true)
			toast.success('Avaliação enviada. Obrigado!')
			onSubmitted()
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Não foi possível enviar a avaliação.'
			)
		} finally {
			setPending(false)
		}
	}

	if (reviewableItems.length === 0) {
		return (
			<div className='rounded-2xl border border-border/70 bg-card p-5'>
				<h2 className='font-heading text-base font-semibold tracking-tight'>
					Avaliar pedido
				</h2>
				<p className='mt-2 text-sm text-muted-foreground'>
					Este pedido não tem produtos disponíveis para avaliação.
				</p>
			</div>
		)
	}

	if (done) {
		return (
			<div className='rounded-2xl border border-emerald-500/20 bg-emerald-500/6 p-5'>
				<div className='flex items-start gap-3'>
					<span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'>
						<CheckCircle2 className='size-5' aria-hidden />
					</span>
					<div>
						<h2 className='font-heading text-base font-semibold tracking-tight'>
							Avaliação enviada
						</h2>
						<p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
							A tua opinião ajuda outros compradores e a loja{' '}
							{storeName}. Se a loja responder, vês a mensagem
							nesta página.
						</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='rounded-2xl border border-border/70 bg-card p-5 sm:p-6'
			noValidate
		>
			<div className='space-y-1'>
				<h2 className='font-heading text-base font-semibold tracking-tight sm:text-lg'>
					Avaliar este pedido
				</h2>
				<p className='text-sm text-muted-foreground'>
					Diz como correu com {storeName} e com os produtos. As notas
					são obrigatórias; os comentários são opcionais.
				</p>
			</div>

			<div className='mt-5 space-y-5'>
				<section className='space-y-3 rounded-xl bg-muted/35 p-4'>
					<StarRatingInput
						id={`store-${orderId}`}
						label='Como foi o atendimento da loja?'
						value={storeRating}
						onChange={(value) => {
							setStoreRating(value)
							setStoreError(null)
						}}
						disabled={pending}
						error={storeError}
					/>
					<div>
						<label
							htmlFor={`store-body-${orderId}`}
							className='text-xs font-medium text-muted-foreground'
						>
							Comentário sobre a loja (opcional)
						</label>
						<Textarea
							id={`store-body-${orderId}`}
							value={storeBody}
							onChange={(e) => setStoreBody(e.target.value)}
							placeholder='Ex.: Responderam rápido e a entrega foi clara…'
							rows={3}
							maxLength={2000}
							disabled={pending}
							className='mt-1.5 resize-none rounded-xl bg-background text-sm'
						/>
					</div>
				</section>

				{reviewableItems.map((item) => {
					const productId = item.productId!
					const draft = productDrafts[productId] ?? {
						rating: 0,
						body: '',
					}

					return (
						<section
							key={item.id}
							className='space-y-3 border-t border-border/60 pt-5'
						>
							<div className='flex items-center gap-3'>
								<div className='relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted'>
									<Image
										src={
											item.imageUrl ?? PRODUCT_PLACEHOLDER
										}
										alt=''
										fill
										placeholder='blur'
										blurDataURL={BLUR_PLACEHOLDER}
										sizes='48px'
										className='object-cover'
									/>
								</div>
								<div className='min-w-0'>
									<p className='truncate text-sm font-medium'>
										{item.productName}
									</p>
									<p className='text-xs text-muted-foreground'>
										Produto do pedido
									</p>
								</div>
							</div>

							<StarRatingInput
								id={`product-${productId}`}
								label='Como chegou o produto?'
								value={draft.rating}
								onChange={(value) => {
									updateProduct(productId, { rating: value })
									setProductErrors((prev) => {
										const next = { ...prev }
										delete next[productId]
										return next
									})
								}}
								disabled={pending}
								error={productErrors[productId] ?? null}
							/>

							<div>
								<label
									htmlFor={`product-body-${productId}`}
									className='text-xs font-medium text-muted-foreground'
								>
									Comentário sobre o produto (opcional)
								</label>
								<Textarea
									id={`product-body-${productId}`}
									value={draft.body}
									onChange={(e) =>
										updateProduct(productId, {
											body: e.target.value,
										})
									}
									placeholder='Ex.: Qualidade boa, chegou como na foto…'
									rows={2}
									maxLength={2000}
									disabled={pending}
									className='mt-1.5 resize-none rounded-xl bg-background text-sm'
								/>
							</div>
						</section>
					)
				})}
			</div>

			<Button
				type='submit'
				className='mt-6 min-h-11 w-full rounded-xl'
				disabled={pending}
			>
				{pending ? 'A enviar avaliação…' : 'Enviar avaliação'}
			</Button>
		</form>
	)
}

export function OrderReviewWaitingPanel({
	statusLabel,
}: {
	statusLabel: string
}) {
	return (
		<div className='rounded-2xl border border-border/70 bg-card p-5 sm:p-6'>
			<h2 className='font-heading text-base font-semibold tracking-tight sm:text-lg'>
				Avaliação
			</h2>
			<p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
				Quando o pedido estiver entregue, podes avaliar a loja e os
				produtos aqui. Se a loja responder, a resposta aparece nesta
				mesma página.
			</p>
			<p className='mt-4 rounded-xl bg-muted/40 px-3 py-2.5 text-sm text-foreground'>
				Estado actual:{' '}
				<span className='font-medium'>{statusLabel}</span>
			</p>
		</div>
	)
}
