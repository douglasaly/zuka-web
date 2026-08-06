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
				answer: 'Abre a página de registo, indica o teu email e uma palavra-passe (mínimo 6 caracteres) e segue os passos. Podes criar conta como comprador ou, se quiseres vender, continuar o fluxo para abrir uma loja.',
				links: [
					{ href: '/signup', label: 'Criar conta' },
					{ href: '/onboarding', label: 'Abrir uma loja' },
				],
			},
			{
				id: 'entrar',
				question: 'Como entro na minha conta?',
				answer: 'Usa o mesmo email e palavra-passe com que te registaste. Se a sessão expirar, volta a entrar, o Zuka usa autenticação segura para manter a tua conta protegida.',
				links: [{ href: '/auth/login', label: 'Entrar' }],
			},
			{
				id: 'perfil',
				question: 'Onde altero o meu perfil?',
				answer: 'Com sessão iniciada, abre o teu perfil para actualizar nome, foto e dados de contacto. Mantém o telefone e o WhatsApp correctos para as lojas te conseguirem contactar.',
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
				answer: 'No início vês o feed e podes abrir Explorar para filtrar por categoria. Também podes pesquisar pelo nome do produto ou da loja. Cada produto mostra a loja, preço e formas de contacto.',
				links: [
					{ href: '/feed/explorar', label: 'Explorar produtos' },
					{ href: '/feed/explorar?tab=stores', label: 'Ver lojas' },
				],
			},
			{
				id: 'contactar',
				question: 'Como falo com uma loja?',
				answer: 'Na página do produto podes abrir WhatsApp, ligar ou iniciar o chat na Zuka. O chat fica nas tuas Mensagens e serve para combinar detalhes da compra com a loja.',
				links: [{ href: '/mensagens', label: 'Abrir mensagens' }],
			},
			{
				id: 'pedido',
				question: 'Como faço um pedido?',
				answer: 'Contacta a loja (WhatsApp, telefone ou chat) e confirma o produto, o preço, o pagamento e a entrega. Os teus pedidos aparecem em Pedidos no menu, para acompanhares o estado.',
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
				answer: 'Cria conta e segue o onboarding da loja: nome, contacto (incluindo WhatsApp), categoria e dados necessários. Depois de publicada, a loja fica visível no marketplace e pode receber encomendas.',
				links: [{ href: '/onboarding', label: 'Começar a abrir loja' }],
			},
			{
				id: 'painel',
				question: 'Onde gerencio produtos e pedidos?',
				answer: 'No painel da loja (dashboard) publicas e editas produtos, respondes a pedidos e acompanhas mensagens dos compradores. Mantém os preços e contactos actualizados.',
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
				answer: 'Não. As conversas da loja ficam no painel do vendedor. A caixa Mensagens do site (menu principal) é para ti como comprador, assim os pedidos da tua loja não se misturam com as tuas compras.',
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
				answer: 'Cada loja define como recebe (por exemplo M-Pesa, e-Mola, mKesh, cartão ou transferência), no respeito pela lei. Confirma sempre com a loja o valor, o método e o comprovativo antes de pagar.',
			},
			{
				id: 'entrega',
				question: 'Quem cuida da entrega?',
				answer: 'A entrega ou o levantamento são combinados contigo e com a loja (prazo, local, custos). O Zuka liga comprador e vendedor; a logística concreta depende do que a loja indicar no anúncio ou na conversa.',
			},
			{
				id: 'problema-compra',
				question: 'E se houver um problema com a compra?',
				answer: 'Fala primeiro com a loja pelo mesmo canal da encomenda. Se precisares de apoio da plataforma (conta, abuso ou conteúdo), escreve para ola@zuka.co.mz com o número do pedido e uma descrição clara do que aconteceu.',
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
				answer: 'Usamos os teus dados para operar a conta, mostrar produtos, permitir contacto com lojas e melhorar o serviço. Podes ler os detalhes e os teus direitos na página de Políticas de Privacidade.',
				links: [
					{ href: '/privacidade', label: 'Política de Privacidade' },
				],
			},
			{
				id: 'regras',
				question: 'Quais são as regras de utilização?',
				answer: 'Os Termos e Condições explicam o que podes e não podes fazer no Zuka, responsabilidades de compradores e lojas, e como tratamos encomendas e conteúdos.',
				links: [{ href: '/termos', label: 'Termos e Condições' }],
			},
			{
				id: 'contacto-ajuda',
				question: 'Como contacto a equipe Zuka?',
				answer: 'Para dúvidas sobre a conta, a loja ou este FAQ, envia email para ola@zuka.co.mz. Inclui o email da conta e, se for sobre um pedido, o número do pedido.',
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
