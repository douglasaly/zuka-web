import { LegalDocument } from '../components/legal-document'

const UPDATED_AT = '2026-08-06'

export function TermsOfUseView() {
	return (
		<LegalDocument
			title='Termos e Condições de Utilização'
			subtitle='Regras para usar o Zuka: contas, compras, lojas, conteúdos e responsabilidades. Leia antes de criar conta ou publicar produtos.'
			updatedAt={UPDATED_AT}
			relatedHref='/privacidade'
			relatedLabel='Política de Privacidade'
			sections={[
				{
					id: 'aceitacao',
					title: 'Aceitação dos termos',
					content: (
						<>
							<p>
								Ao aceder, registar-se ou utilizar o Zuka
								(«Plataforma»), operada pela{' '}
								<strong>NORTHBRIDGE LABS</strong>, declara ter
								lido, compreendido e aceite estes Termos e
								Condições de Utilização («Termos»), bem como a
								nossa Política de Privacidade.
							</p>
							<p>
								Se não concordar com alguma disposição, não deve
								utilizar a Plataforma. Podemos recusar ou
								suspender o acesso em caso de incumprimento.
							</p>
						</>
					),
				},
				{
					id: 'objecto',
					title: 'Objecto do serviço',
					content: (
						<>
							<p>
								O Zuka é um marketplace multivendedor que
								permite a lojas publicarem produtos e a
								compradores explorarem o catálogo, contactarem
								vendedores e efectuarem encomendas.
							</p>
							<p>
								A NORTHBRIDGE LABS disponibiliza a
								infra-estrutura tecnológica. Salvo indicação
								expressa em contrário,{' '}
								<strong>
									não somos parte do contrato de compra e
									venda
								</strong>{' '}
								celebrado entre comprador e loja, nem garantimos
								stock, qualidade, entrega ou pagamento fora dos
								fluxos previstos na Plataforma.
							</p>
						</>
					),
				},
				{
					id: 'regime-legal',
					title: 'Enquadramento legal aplicável',
					content: (
						<>
							<p>
								Estes Termos e a actividade do Zuka em
								Moçambique seguem, em particular, os seguintes
								diplomas:
							</p>
							<ul>
								<li>
									<strong>Código Comercial:</strong> regula os
									actos de comércio, os comerciantes e os
									contratos celebrados entre lojas e
									compradores na Plataforma.
								</li>
								<li>
									<strong>
										Lei n.º 3/2017, de 9 de Janeiro:
									</strong>{' '}
									regula o comércio electrónico e o governo
									electrónico, aplicando-se directamente às
									compras feitas através do Zuka.
								</li>
								<li>
									<strong>
										Lei n.º 22/2009, de 28 de Setembro (Lei
										de Defesa do Consumidor):
									</strong>{' '}
									atribui direitos aos compradores enquanto
									consumidores, nomeadamente à qualidade,
									informação e reparação de danos, e prevê a
									intervenção do Instituto do Consumidor.
								</li>
								<li>
									<strong>Código Civil:</strong> rege os
									contratos em geral, a responsabilidade civil
									e a resolução de litígios entre as partes.
								</li>
							</ul>
							<p>
								Havendo conflito entre uma cláusula destes
								Termos e um direito imperativo previsto nestas
								leis, prevalece a lei.
							</p>
						</>
					),
				},
				{
					id: 'contas',
					title: 'Contas e elegibilidade',
					content: (
						<>
							<p>
								Para utilizar funcionalidades completas deve
								criar uma conta com informação verdadeira,
								completa e actualizada. É responsável por
								proteger as suas credenciais e por toda a
								actividade realizada sob a sua conta.
							</p>
							<ul>
								<li>
									Deve ter capacidade legal para contratar em
									Moçambique.
								</li>
								<li>
									Uma pessoa ou entidade não deve criar contas
									múltiplas com o intuito de contornar
									limites, sanções ou verificações.
								</li>
								<li>
									Vendedores podem ter de concluir o processo
									de onboarding e verificação antes de
									publicar produtos ou receber encomendas.
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'compradores',
					title: 'Obrigações dos compradores',
					content: (
						<>
							<p>O comprador compromete-se a:</p>
							<ul>
								<li>
									utilizar a Plataforma de boa fé e apenas
									para fins lícitos;
								</li>
								<li>
									fornecer dados de contacto e de entrega
									correctos;
								</li>
								<li>
									respeitar os termos de pagamento e
									levantamento acordados com a loja;
								</li>
								<li>
									comunicar-se de forma civilizada através dos
									canais da Plataforma;
								</li>
								<li>
									não solicitar ou efectuar pagamentos fora
									dos meios recomendados com o intuito de
									fraude.
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'vendedores',
					title: 'Obrigações dos vendedores',
					content: (
						<>
							<p>O vendedor / gestor de loja compromete-se a:</p>
							<ul>
								<li>
									publicar apenas produtos lícitos, com
									descrições e imagens fiéis;
								</li>
								<li>
									indicar preços, condições de entrega e
									disponibilidade de forma clara;
								</li>
								<li>
									cumprir a legislação comercial, fiscal e de
									defesa do consumidor aplicável em
									Moçambique, incluindo a Lei n.º 22/2009;
								</li>
								<li>
									responder a encomendas e mensagens em prazo
									razoável;
								</li>
								<li>
									não utilizar a Plataforma para práticas
									enganosas, spam, produtos proibidos ou
									conteúdo ilícito;
								</li>
								<li>
									manter documentos de verificação válidos,
									quando solicitados.
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'encomendas',
					title: 'Encomendas, pagamentos e entregas',
					content: (
						<>
							<p>
								As condições concretas de cada compra
								(pagamento, levantamento, envio, prazos e
								garantias) são definidas pela loja, no respeito
								pela lei. O Zuka pode disponibilizar meios de
								pagamento ou fluxos de confirmação (por exemplo,
								M-Pesa, e-Mola, cartão ou transferência),
								sujeitos às regras do Banco de Moçambique
								aplicáveis a esses meios, sem assumir a
								qualidade do bem nem a execução logística,
								excepto quando expressamente indicado.
							</p>
							<p>
								Em caso de litígio entre comprador e vendedor,
								as partes devem procurar resolução amigável,
								podendo o comprador recorrer ainda ao Instituto
								do Consumidor nos termos da Lei n.º 22/2009. A
								Zuka pode, a seu critério, mediar ou suspender
								contas envolvidas em comportamento abusivo, sem
								obrigação de arbitrar o mérito comercial.
							</p>
						</>
					),
				},
				{
					id: 'conteudos',
					title: 'Conteúdos e propriedade intelectual',
					content: (
						<>
							<p>
								O utilizador mantém os direitos sobre os
								conteúdos que publica (textos, imagens, marcas),
								concedendo à NORTHBRIDGE LABS uma licença não
								exclusiva, mundial e gratuita para hospedar,
								reproduzir e apresentar esses conteúdos na
								Plataforma e em materiais de promoção do
								serviço.
							</p>
							<p>
								A marca Zuka, o logótipo, o desenho da interface
								e o software associado são propriedade da
								NORTHBRIDGE LABS ou dos seus licenciadores. É
								proibida a cópia, engenharia inversa ou
								exploração comercial não autorizada.
							</p>
						</>
					),
				},
				{
					id: 'conduta',
					title: 'Conduta proibida',
					content: (
						<>
							<p>É interdito, entre outros:</p>
							<ul>
								<li>
									violar leis, direitos de terceiros ou estes
									Termos;
								</li>
								<li>
									carregar vírus, automatizar abusivamente o
									acesso ou tentar comprometer a segurança;
								</li>
								<li>
									publicar conteúdo difamatório, obsceno,
									discriminatório ou enganador;
								</li>
								<li>
									manipular avaliações, preços ou
									disponibilidade de forma fraudulenta;
								</li>
								<li>
									utilizar dados de outros utilizadores para
									fins não autorizados.
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'suspensao',
					title: 'Suspensão e encerramento',
					content: (
						<>
							<p>
								Podemos suspender, limitar ou encerrar contas,
								anúncios ou funcionalidades, com ou sem aviso
								prévio, quando haja suspeita fundada de fraude,
								incumprimento, risco de segurança ou exigência
								legal. O utilizador pode solicitar o
								encerramento da conta através das definições ou
								por contacto connosco.
							</p>
						</>
					),
				},
				{
					id: 'responsabilidade',
					title: 'Limitação de responsabilidade',
					content: (
						<>
							<p>
								Na medida máxima permitida pela lei moçambicana,
								a NORTHBRIDGE LABS não responde por danos
								indirectos, lucros cessantes, perda de dados ou
								prejuízos resultantes de:
							</p>
							<ul>
								<li>transacções entre compradores e lojas;</li>
								<li>
									indisponibilidade temporária da Plataforma
									ou de serviços de terceiros;
								</li>
								<li>
									informações incorrectas publicadas por
									utilizadores;
								</li>
								<li>
									falhas de rede, equipemento ou factores fora
									do nosso controlo razoável.
								</li>
							</ul>
							<p>
								Nada nestes Termos exclui responsabilidade que
								não possa ser limitada por lei, incluindo os
								direitos imperativos previstos na Lei n.º
								22/2009.
							</p>
						</>
					),
				},
				{
					id: 'alteracoes-lei',
					title: 'Alterações e lei aplicável',
					content: (
						<>
							<p>
								Podemos rever estes Termos periodicamente. A
								versão vigente será publicada nesta página com a
								data de actualização. Em caso de alteração
								substancial, poderemos notificar os utilizadores
								registados.
							</p>
							<p>
								Estes Termos regem-se pela lei da República de
								Moçambique. Qualquer litígio será submetido aos
								tribunais competentes em Moçambique, sem
								prejuízo de direitos imperativos do consumidor
								previstos na Lei n.º 22/2009 e demais legislação
								aplicável.
							</p>
							<p>
								Para questões sobre estes Termos, contacte{' '}
								<a href='mailto:ola@zuka.co.mz'>
									ola@zuka.co.mz
								</a>
								.
							</p>
						</>
					),
				},
			]}
		/>
	)
}
