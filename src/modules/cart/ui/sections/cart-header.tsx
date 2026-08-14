type CartHeaderProps = {
	storeCount: number
	itemCount: number
	ready?: boolean
}

export function CartHeader({
	storeCount,
	itemCount,
	ready = true,
}: CartHeaderProps) {
	const summary = !ready
		? 'O pagamento e a entrega combinam-se com cada loja.'
		: storeCount === 0
			? 'Começa por um produto. Depois fazes o pedido directo à loja.'
			: storeCount === 1
				? itemCount === 1
					? '1 produto numa loja. Faz o pedido, tu combinas pagamento e entrega no WhatsApp ou chat.'
					: `${itemCount} produtos numa loja. Faz o pedido, tu combinas pagamento e entrega no WhatsApp ou chat.`
				: `${itemCount} produtos em ${storeCount} lojas. Cada loja recebe o seu próprio pedido.`

	return (
		<header className='mb-5 sm:mb-6'>
			<h1 className='font-heading text-2xl font-bold tracking-tight md:text-3xl'>
				Carrinho
			</h1>
			<p className='mt-1 max-w-2xl text-sm text-muted-foreground'>
				{summary}
			</p>
		</header>
	)
}
