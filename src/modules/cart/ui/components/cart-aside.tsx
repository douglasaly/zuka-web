'use client'
import { ArrowRight, MessageCircle, Store, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	cartCurrency,
	cartsItemCount,
	cartsTotal,
} from '@/modules/cart/lib/cart-utils'
import type { Cart } from '@/modules/cart/types'
import { formatPrice } from '@/utils/format-price'

type CartAsideProps = {
	carts: Cart[]
	priceChangeCount: number
	unavailableCount: number
	onApplyAllPrices: () => void
	onRemoveUnavailable: () => void
	onClearAll: () => void
	className?: string
}
export function CartAside({
	carts,
	priceChangeCount,
	unavailableCount,
	onApplyAllPrices,
	onRemoveUnavailable,
	onClearAll,
	className,
}: CartAsideProps) {
	const itemCount = cartsItemCount(carts)
	const total = cartsTotal(carts)
	const currency = carts[0] ? cartCurrency(carts[0]) : 'MZN'
	const firstStore = carts[0]
	const storeCount = carts.length
	const hasIssues = priceChangeCount > 0 || unavailableCount > 0
	return (
		<aside
			className={cn(
				'flex w-full flex-col gap-4 lg:sticky lg:top-24 lg:w-[min(100%,22rem)] xl:w-96',
				className
			)}
			aria-label='Resumo e próximos passos'
		>
			<section className='overflow-hidden rounded-2xl bg-secondary text-secondary-foreground shadow-[0_12px_32px_-16px_color-mix(in_oklch,#e8340a_65%,transparent)]'>
				<div className='space-y-1 px-5 pt-5 pb-4'>
					<h2 className='font-heading text-base font-bold tracking-tight'>
						Próximo passo
					</h2>
					<p className='text-sm text-secondary-foreground/85'>
						Faz o pedido a cada loja. O vendedor recebe notificação
						e tu combinas pagamento e entrega no WhatsApp ou chat.
						chat.
					</p>
				</div>
				<div className='flex items-end justify-between gap-3 border-t border-white/15 px-5 py-4'>
					<div>
						<p className='text-xs text-secondary-foreground/75'>
							{storeCount === 1
								? '1 loja'
								: `${storeCount} lojas`}
							{' · '}
							{itemCount === 1 ? '1 item' : `${itemCount} itens`}
						</p>
						<p className='font-heading text-xl font-bold tabular-nums tracking-tight'>
							{formatPrice(total, currency)}
						</p>
					</div>
				</div>
			</section>

			{hasIssues ? (
				<section className='rounded-2xl border border-border/70 bg-card p-5'>
					<div className='flex items-start gap-2'>
						<TriangleAlert
							className='mt-0.5 size-4 shrink-0 text-amber-700'
							aria-hidden
						/>
						<div className='min-w-0'>
							<h2 className='font-heading text-sm font-semibold tracking-tight'>
								Há itens a rever
							</h2>
							<p className='mt-1 text-sm text-muted-foreground'>
								Actualiza preços ou remove o que já não está à
								venda antes de fazer o pedido.
							</p>
						</div>
					</div>
					<div className='mt-4 flex flex-col gap-2'>
						{priceChangeCount > 0 ? (
							<Button
								type='button'
								variant='outline'
								className='min-h-11 w-full rounded-xl'
								onClick={onApplyAllPrices}
							>
								Usar preços actuais
								<span className='tabular-nums opacity-70'>
									({priceChangeCount})
								</span>
							</Button>
						) : null}
						{unavailableCount > 0 ? (
							<Button
								type='button'
								variant='outline'
								className='min-h-11 w-full rounded-xl'
								onClick={onRemoveUnavailable}
							>
								Remover indisponíveis
								<span className='tabular-nums opacity-70'>
									({unavailableCount})
								</span>
							</Button>
						) : null}
					</div>
				</section>
			) : null}

			<section className='relative overflow-hidden rounded-2xl border border-border/70 bg-linear-to-br from-foreground to-foreground/90 p-5 text-background'>
				<div
					aria-hidden
					className='pointer-events-none absolute -top-10 -right-8 size-36 rounded-full bg-secondary/35 blur-2xl'
				/>
				<div className='relative space-y-3'>
					<h2 className='font-heading text-lg font-bold tracking-tight'>
						Continuar
					</h2>
					<p className='text-sm leading-relaxed text-background/75'>
						Abre a loja para ver mais produtos, ou volta a explorar
						o catálogo.
					</p>
					<div className='flex flex-col gap-2 pt-1'>
						{firstStore ? (
							<Button
								className='min-h-11 w-full rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90'
								render={
									<Link
										href={`/lojas/${firstStore.storeSlug}`}
									/>
								}
							>
								<Store className='size-4' aria-hidden />
								{storeCount === 1
									? 'Ver loja'
									: `Ver ${firstStore.storeName}`}
							</Button>
						) : null}
						<Button
							variant='ghost'
							className='min-h-11 w-full rounded-xl text-background hover:bg-white/10 hover:text-background'
							render={<Link href='/feed/explorar' />}
						>
							Explorar produtos
							<ArrowRight className='size-4' aria-hidden />
						</Button>
						<Button
							variant='ghost'
							className='min-h-11 w-full rounded-xl text-background hover:bg-white/10 hover:text-background'
							render={<Link href='/mensagens' />}
						>
							<MessageCircle className='size-4' aria-hidden />
							Abrir mensagens
						</Button>
					</div>
				</div>
			</section>

			<section className='rounded-2xl border border-dashed border-border/80 bg-muted/25 p-4'>
				<p className='text-xs font-medium text-foreground'>Dica</p>
				<ul className='mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground'>
					<li>
						Confirma o preço e a disponibilidade com a loja antes de
						pagar.
					</li>
					<li>
						Podes ter um carrinho por loja, cada vendedor trata do
						seu pedido.
					</li>
				</ul>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					className='mt-3 min-h-9 w-full rounded-xl text-muted-foreground'
					onClick={onClearAll}
				>
					Esvaziar todos os carrinhos
				</Button>
			</section>
		</aside>
	)
}
