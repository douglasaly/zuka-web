export type FaqItem = {
	id: string
	question: string
	answer: string
	/** Optional inline links rendered after the answer paragraphs */
	links?: { href: string; label: string }[]
}

export type FaqCategory = {
	id: string
	label: string
	items: FaqItem[]
}

export const FAQ_CATEGORIES: FaqCategory[] = [
	{
		id: 'conta',
		label: 'Conta',
		items: [
			{
				id: 'criar-conta',
				question: 'Como crio uma conta na Zuka?',
				answer: 'Abra a página de registo, indique o seu email e uma palavra-passe e siga os passos. Pode criar conta como comprador ou, se quiser vender, continuar o fluxo para abrir uma loja.',
				links: [
					{ href: '/signup', label: 'Criar conta' },
					{ href: '/onboarding/seller', label: 'Abrir uma loja' },
				],
			},
			{
				id: 'entrar',
				question: 'Como entro na minha conta?',
				answer: 'Use o mesmo email e palavra-passe com que se registou. Se a sessão expirar, volte a entrar. O Zuka usa autenticação segura para manter a sua conta protegida.',
				links: [{ href: '/auth/login', label: 'Entrar' }],
			},
			{
				id: 'perfil',
				question: 'Onde altero o meu perfil?',
				answer: 'Com sessão iniciada, abra o seu perfil para actualizar nome, foto e dados de contacto. Mantenha o telefone e o WhatsApp correctos para as lojas o conseguirem contactar.',
				links: [{ href: '/perfil', label: 'Ir ao perfil' }],
			},
		],
	},
	{
		id: 'comprar',
		label: 'Comprar',
		items: [
			{
				id: 'encontrar',
				question: 'Como encontro produtos ou lojas?',
				answer: 'No início vê o feed e pode abrir Explorar para filtrar por categoria. Também pode pesquisar pelo nome do produto ou da loja. Cada produto mostra a loja, preço e formas de contacto.',
				links: [
					{ href: '/feed/explorar', label: 'Explorar produtos' },
					{ href: '/feed/explorar?tab=stores', label: 'Ver lojas' },
				],
			},
			{
				id: 'contactar',
				question: 'Como falo com uma loja?',
				answer: 'Na página do produto pode abrir WhatsApp, ligar ou iniciar o chat na Zuka. O chat fica nas suas Mensagens e serve para combinar detalhes da compra com a loja.',
				links: [{ href: '/mensagens', label: 'Abrir mensagens' }],
			},
			{
				id: 'pedido',
				question: 'Como faço um pedido?',
				answer: 'Contacte a loja (WhatsApp, telefone ou chat) e confirme o produto, o preço, o pagamento e a entrega. Os seus pedidos aparecem em Pedidos no menu, para acompanhar o estado.',
				links: [
					{ href: '/feed/pedidos', label: 'Ver os meus pedidos' },
				],
			},
			{
				id: 'avaliar',
				question: 'Posso avaliar um produto ou uma loja?',
				answer: 'Sim, depois de um pedido concluído (entregue). As avaliações ajudam outros compradores a decidir com mais confiança. Enquanto a compra não estiver concluída, a avaliação ainda não fica disponível.',
			},
		],
	},
	{
		id: 'vender',
		label: 'Vender',
		items: [
			{
				id: 'abrir-loja',
				question: 'Como abro uma loja na Zuka?',
				answer: 'Crie conta e siga o onboarding da loja: nome, contacto (incluindo WhatsApp), categoria e dados necessários. Depois de publicada, a loja fica visível no marketplace e pode receber encomendas.',
				links: [
					{
						href: '/onboarding/seller',
						label: 'Começar a abrir loja',
					},
				],
			},
			{
				id: 'painel',
				question: 'Onde faço a gestão de produtos e pedidos?',
				answer: 'No painel da loja (dashboard) publica e edita produtos, responde a pedidos e acompanha mensagens dos compradores. Mantenha os preços e contactos actualizados.',
				links: [
					{
						href: '/dashboard/seller',
						label: 'Abrir painel da loja',
					},
				],
			},
			{
				id: 'mensagens-loja',
				question: 'As mensagens da loja são as mesmas do comprador?',
				answer: 'Não. As conversas da loja ficam no painel do vendedor. A caixa Mensagens do site (menu principal) é para si como comprador, assim os pedidos da sua loja não se misturam com as suas compras.',
			},
		],
	},
	{
		id: 'pagamentos',
		label: 'Pagamentos e entregas',
		items: [
			{
				id: 'metodos',
				question: 'Que formas de pagamento existem?',
				answer: 'Cada loja define como recebe (por exemplo M-Pesa, e-Mola, Mkesh, cartão ou transferência), no respeito pela lei. Confirme sempre com a loja o valor, o método e o comprovativo antes de pagar.',
			},
			{
				id: 'entrega',
				question: 'Quem cuida da entrega?',
				answer: 'A entrega ou o levantamento são combinados consigo e com a loja (prazo, local, custos). O Zuka liga comprador e vendedor; a logística concreta depende do que a loja indicar no anúncio ou na conversa.',
			},
			{
				id: 'problema-compra',
				question: 'E se houver um problema com a compra?',
				answer: 'Fale primeiro com a loja pelo mesmo canal da encomenda. Se precisar de apoio da plataforma (conta, abuso ou conteúdo), escreva para ola@zuka.co.mz com o número do pedido e uma descrição clara do que aconteceu.',
				links: [
					{
						href: 'mailto:ola@zuka.co.mz',
						label: 'Escrever para ola@zuka.co.mz',
					},
				],
			},
		],
	},
	{
		id: 'seguranca',
		label: 'Segurança e privacidade',
		items: [
			{
				id: 'dados',
				question: 'O que acontece aos meus dados?',
				answer: 'Usamos os seus dados para operar a conta, mostrar produtos, permitir contacto com lojas e melhorar o serviço. Pode ler os detalhes e os seus direitos na página de Política de Privacidade.',
				links: [
					{ href: '/privacidade', label: 'Política de Privacidade' },
				],
			},
			{
				id: 'regras',
				question: 'Quais são as regras de utilização?',
				answer: 'Os Termos e Condições explicam o que pode e não pode fazer no Zuka, as responsabilidades de compradores e lojas, e como tratamos encomendas e conteúdos.',
				links: [
					{
						href: '/termos-e-condicoes',
						label: 'Termos e Condições',
					},
				],
			},
			{
				id: 'contacto-ajuda',
				question: 'Como contacto a equipe Zuka?',
				answer: 'Para dúvidas sobre a conta, a loja ou este FAQ, envie email para ola@zuka.co.mz. Inclua o email da conta e, se for sobre um pedido, o número do pedido.',
				links: [
					{
						href: 'mailto:ola@zuka.co.mz',
						label: 'ola@zuka.co.mz',
					},
				],
			},
		],
	},
]
