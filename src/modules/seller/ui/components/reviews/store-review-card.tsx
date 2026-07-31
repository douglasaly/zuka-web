'use client'

import { MessageSquare, Package } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BLUR_PLACEHOLDER } from '@/lib/constants/images'
import { StarRating } from './star-rating'
import type { SellerProductReview, SellerStoreReview } from './types'

function formatReviewDate(iso: string) {
	return new Date(iso).toLocaleDateString('pt-PT', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

function Initials({ name }: { name: string }) {
	const initials = name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((n) => n[0]?.toUpperCase() ?? '')
		.join('')
	return (
		<div
			className='flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground'
			aria-hidden
		>
			{initials || '?'}
		</div>
	)
}

type ReplyFormProps = {
	reviewId: string
	onSuccess: (reply: string) => void
	onCancel: () => void
}

function ReplyForm({ reviewId, onSuccess, onCancel }: ReplyFormProps) {
	const [reply, setReply] = useState('')
	const [pending, setPending] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		const trimmed = reply.trim()
		if (!trimmed || pending) return
		setPending(true)
		try {
			const res = await fetch(`/api/seller/reviews/${reviewId}/reply`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ reply: trimmed }),
			})
			const json = await res.json().catch(() => ({}))
			if (!res.ok) {
				throw new Error(
					json.error ?? 'Não foi possível enviar a resposta'
				)
			}
			toast.success('Resposta enviada')
			onSuccess(trimmed)
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : 'Erro ao responder'
			)
		} finally {
			setPending(false)
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3'
		>
			<label
				htmlFor={`reply-${reviewId}`}
				className='block text-xs font-medium text-foreground'
			>
				A sua resposta
			</label>
			<Textarea
				id={`reply-${reviewId}`}
				value={reply}
				onChange={(e) => setReply(e.target.value)}
				placeholder='Ex.: Obrigado pelo feedback…'
				rows={3}
				maxLength={2000}
				className='mt-1.5 resize-none rounded-xl bg-background text-sm'
				disabled={pending}
				aria-label='Texto da resposta ao cliente'
			/>
			<div className='flex flex-wrap justify-end gap-2'>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					className='rounded-full'
					onClick={onCancel}
					disabled={pending}
				>
					Cancelar
				</Button>
				<Button
					type='submit'
					size='sm'
					className='rounded-full'
					disabled={!reply.trim() || pending}
				>
					{pending ? 'A enviar…' : 'Responder'}
				</Button>
			</div>
		</form>
	)
}

type StoreReviewCardProps = {
	review: SellerStoreReview
	onReplied: (reviewId: string, reply: string) => void
}

export function StoreReviewCard({
	review,
	onReplied,
	canReply = true,
}: StoreReviewCardProps & { canReply?: boolean }) {
	const [replying, setReplying] = useState(false)

	return (
		<article className='rounded-2xl border border-border/60 bg-card p-4 sm:p-5'>
			<div className='flex items-start justify-between gap-3'>
				<div className='flex min-w-0 items-start gap-3'>
					<Initials name={review.buyerName} />
					<div className='min-w-0'>
						<p className='truncate text-sm font-medium'>
							{review.buyerName}
						</p>
						<p className='text-xs text-muted-foreground'>
							Pedido #{review.shortOrderId} ·{' '}
							{formatReviewDate(review.createdAt)}
						</p>
					</div>
				</div>
				<StarRating rating={review.rating} />
			</div>

			{review.body ? (
				<p className='mt-3 text-sm leading-relaxed text-foreground/90'>
					{review.body}
				</p>
			) : (
				<p className='mt-3 text-sm italic text-muted-foreground'>
					Sem comentário sobre o atendimento.
				</p>
			)}

			{review.products.length > 0 ? (
				<ul className='mt-3 space-y-2 border-t border-border/50 pt-3'>
					{review.products.map((p) => (
						<li
							key={p.id}
							className='flex items-center gap-3 text-sm'
						>
							<div className='relative size-9 shrink-0 overflow-hidden rounded-lg bg-muted'>
								{p.productImage ? (
									<Image
										src={p.productImage}
										alt=''
										fill
										className='object-cover'
										sizes='36px'
										placeholder='blur'
										blurDataURL={BLUR_PLACEHOLDER}
									/>
								) : (
									<div className='flex size-full items-center justify-center'>
										<Package className='size-3.5 text-muted-foreground' />
									</div>
								)}
							</div>
							<div className='min-w-0 flex-1'>
								<p className='truncate font-medium'>
									{p.productName}
								</p>
								{p.body ? (
									<p className='truncate text-xs text-muted-foreground'>
										{p.body}
									</p>
								) : null}
							</div>
							<StarRating rating={p.rating} />
						</li>
					))}
				</ul>
			) : null}

			{review.storeReply ? (
				<div className='mt-3 rounded-xl bg-muted/50 px-3 py-2.5'>
					<div className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
						<MessageSquare className='size-3' aria-hidden />
						<span>A sua resposta</span>
						{review.storeRepliedAt ? (
							<span className='font-normal'>
								· {formatReviewDate(review.storeRepliedAt)}
							</span>
						) : null}
					</div>
					<p className='mt-1 text-sm leading-relaxed'>
						{review.storeReply}
					</p>
				</div>
			) : canReply && replying ? (
				<ReplyForm
					reviewId={review.id}
					onCancel={() => setReplying(false)}
					onSuccess={(reply) => {
						setReplying(false)
						onReplied(review.id, reply)
					}}
				/>
			) : canReply ? (
				<Button
					type='button'
					variant='ghost'
					size='sm'
					className='mt-3 h-8 rounded-full px-3 text-xs'
					onClick={() => setReplying(true)}
				>
					Responder ao cliente
				</Button>
			) : null}
		</article>
	)
}

type ProductReviewCardProps = {
	review: SellerProductReview
}

export function ProductReviewCard({ review }: ProductReviewCardProps) {
	return (
		<article className='flex gap-3 rounded-2xl border border-border/60 bg-card p-4 sm:gap-4 sm:p-5'>
			<div className='relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-16'>
				{review.productImage ? (
					<Image
						src={review.productImage}
						alt=''
						fill
						className='object-cover'
						sizes='64px'
						placeholder='blur'
						blurDataURL={BLUR_PLACEHOLDER}
					/>
				) : (
					<div className='flex size-full items-center justify-center'>
						<Package className='size-5 text-muted-foreground' />
					</div>
				)}
			</div>
			<div className='min-w-0 flex-1'>
				<div className='flex items-start justify-between gap-2'>
					<div className='min-w-0'>
						<p className='truncate font-medium'>
							{review.productName}
						</p>
						<p className='text-xs text-muted-foreground'>
							{review.buyerName} · Pedido #{review.shortOrderId} ·{' '}
							{formatReviewDate(review.createdAt)}
						</p>
					</div>
					<StarRating rating={review.rating} />
				</div>
				{review.body ? (
					<p className='mt-2 text-sm leading-relaxed text-foreground/90'>
						{review.body}
					</p>
				) : (
					<p className='mt-2 text-sm italic text-muted-foreground'>
						Sem comentário sobre o produto.
					</p>
				)}
			</div>
		</article>
	)
}
