import { LegalDocument } from '../components/legal-document'

const UPDATED_AT = '2026-08-06'

export function PrivacyPolicyView() {
	return (
		<LegalDocument
			title='Política de Privacidade'
			subtitle='O que o Zuka (NORTHBRIDGE LABS) faz com os seus dados pessoais quando usa a plataforma em Moçambique, e como pode pedir acesso, correcção ou eliminação.'
			updatedAt={UPDATED_AT}
			relatedHref='/termos'
			relatedLabel='Termos e Condições de Utilização'
			sections={[
				{
					id: 'resumo',
					title: 'Em resumo',
					content: (
						<>
							<p>
								Usamos os seus dados para operar a conta, as
								encomendas, as mensagens e a segurança da Zuka.
								<br />
								<strong>Não vendemos dados pessoais.</strong>
							</p>
							<p>
								Moçambique ainda não tem uma lei geral de
								protecção de dados pessoais em vigor. A Proposta
								de Lei que cria esse regime foi aprovada pelo
								Conselho de Ministros em Março de 2026 e aguarda
								votação na Assembleia da República. Até essa lei
								entrar em vigor, baseamo-nos no direito
								constitucional à privacidade, na Lei n.º 3/2017
								(comércio e governo electrónico) e nas boas
								práticas descritas nesta política, que aplicamos
								como compromisso próprio do Zuka.
							</p>
							<p>
								Pode pedir para ver, corrigir ou apagar os seus
								dados em{' '}
								<a href='mailto:ola@zuka.co.mz'>
									ola@zuka.co.mz
								</a>
								.
							</p>
						</>
					),
				},
				{
					id: 'quem-somos',
					title: 'Quem controla os dados',
					content: (
						<>
							<p>
								A <strong>NORTHBRIDGE LABS</strong>, operadora
								da marca Zuka, é responsável pelos dados
								pessoais tratados nesta plataforma.
							</p>
							<ul>
								<li>
									Email:{' '}
									<a href='mailto:ola@zuka.co.mz'>
										ola@zuka.co.mz
									</a>
								</li>
								<li>
									Assunto sugerido:{' '}
									<strong>Privacidade</strong>
								</li>
							</ul>
							<p>
								Enquanto não existir uma Autoridade Nacional de
								Protecção de Dados Pessoais em funcionamento, é
								a NORTHBRIDGE LABS quem recebe e responde
								directamente aos pedidos sobre os seus dados.
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
								Esta política segue o quadro legal actualmente
								em vigor em Moçambique:
							</p>
							<ul>
								<li>
									<strong>Constituição da República:</strong>{' '}
									reconhece o direito à reserva da intimidade
									da vida privada e familiar.
								</li>
								<li>
									<strong>
										Lei n.º 3/2017, de 9 de Janeiro:
									</strong>{' '}
									regula o comércio electrónico e o governo
									electrónico, incluindo aspectos de
									privacidade nas transacções em linha. É
									actualmente o diploma mais relevante para
									plataformas como a Zuka.
								</li>
								<li>
									<strong>Código Civil:</strong> protege o
									direito à identidade, à imagem e à reserva
									da vida privada.
								</li>
								<li>
									<strong>Convenção de Malabo:</strong>{' '}
									Moçambique ratificou em 2019 a Convenção da
									União Africana sobre Cibersegurança e
									Protecção de Dados Pessoais, que orienta o
									país neste tema mesmo antes de existir lei
									própria.
								</li>
								<li>
									<strong>Regras sectoriais:</strong> o Banco
									de Moçambique e o INCM têm regras próprias
									sobre dados financeiros e de
									telecomunicações, que respeitamos quando
									aplicáveis (por exemplo, em pagamentos via
									M-Pesa ou e-Mola).
								</li>
							</ul>
							<p>
								Assim que a nova Lei de Protecção de Dados
								Pessoais entrar em vigor, actualizaremos esta
								política para reflectir as novas obrigações,
								incluindo a eventual comunicação com a futura
								Autoridade Nacional de Protecção de Dados
								Pessoais.
							</p>
						</>
					),
				},
				{
					id: 'que-dados',
					title: 'Que dados recolhemos',
					content: (
						<>
							<p>
								Consoante o que fizer na Zuka, podemos guardar:
							</p>
							<ul>
								<li>
									<strong>Conta:</strong> nome, email,
									telefone, foto de perfil e dados de entrada
									(login).
								</li>
								<li>
									<strong>Loja (vendedores):</strong> nome e
									descrição da loja, documentos de
									verificação, contactos comerciais e dados
									dos produtos.
								</li>
								<li>
									<strong>Compras:</strong> pedidos, valores,
									método de pagamento indicado, endereço de
									entrega e histórico associado.
								</li>
								<li>
									<strong>Conversas:</strong> mensagens entre
									comprador e loja, e pedidos de apoio.
								</li>
								<li>
									<strong>Técnicos:</strong> IP, tipo de
									dispositivo e navegador, páginas visitadas,
									sessão e cookies necessários ao serviço.
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'para-que',
					title: 'Para que usamos os dados',
					content: (
						<>
							<ul>
								<li>
									criar e gerir contas de comprador e loja;
								</li>
								<li>
									mostrar produtos, permitir encomendas e
									contactar a outra parte;
								</li>
								<li>
									acompanhar o estado das compras e das
									mensagens;
								</li>
								<li>
									verificar lojas, prevenir fraude e manter a
									plataforma segura;
								</li>
								<li>
									enviar avisos úteis (ex.: actualização de
									pedido ou nova mensagem);
								</li>
								<li>
									melhorar o serviço e corrigir falhas
									técnicas;
								</li>
								<li>
									cumprir a lei e responder a autoridades,
									quando for obrigatório (por exemplo, ao
									Banco de Moçambique em matérias de
									pagamentos).
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'porque-podemos',
					title: 'Porque podemos tratar estes dados',
					content: (
						<>
							<p>Fazemo-lo porque, conforme o caso:</p>
							<ul>
								<li>
									é preciso para cumprir o contrato de uso da
									Zuka (conta, encomendas, mensagens);
								</li>
								<li>
									há interesse legítimo em segurança e
									melhoria do serviço, sempre com cuidado para
									não prejudicar indevidamente os seus
									direitos;
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'com-quem',
					title: 'Com quem partilhamos',
					content: (
						<>
							<p>
								<strong>Não vendemos</strong> os seus dados
								pessoais. Podemos partilhar só o necessário com:
							</p>
							<ul>
								<li>
									<strong>Outros utilizadores:</strong> o que
									a compra ou a loja pública exigem (ex.: a
									loja vê o seu nome/contacto num pedido; o
									público vê dados da loja).
								</li>
								<li>
									<strong>Parceiros técnicos:</strong>{' '}
									alojamento, autenticação, ficheiros,
									notificações e suporte, com dever de
									confidencialidade.
								</li>
								<li>
									<strong>Pagamentos:</strong> operadores como
									M-Pesa, e-Mola ou outros, quando a
									transacção o exigir, sujeitos às regras do
									Banco de Moçambique.
								</li>
								<li>
									<strong>Autoridades:</strong> se a lei
									obrigar, ou para proteger direitos e
									segurança do Zuka.
								</li>
							</ul>
						</>
					),
				},
				{
					id: 'quanto-tempo',
					title: 'Quanto tempo guardamos e como protegemos',
					content: (
						<>
							<p>
								Guardamos os dados só enquanto forem necessários
								para as finalidades acima, para prazos legais ou
								para resolver litígios. Contas inactivas ou
								apagadas podem ser eliminadas ou anonimizadas,
								excepto quando a lei exigir conservação.
							</p>
							<p>
								Usamos medidas técnicas e organizativas
								razoáveis contra acesso indevido, perda ou
								alteração. Nenhum sistema é 100% seguro: proteja
								a sua palavra-passe e avise-nos se suspeitar de
								uso indevido da conta.
							</p>
						</>
					),
				},
				{
					id: 'os-seus-direitos',
					title: 'Os seus direitos (e como exercê-los)',
					content: (
						<>
							<p>
								Mesmo antes de existir uma lei geral de
								protecção de dados, reconhecemos-lhe estes
								direitos como política própria da Zuka, alinhada
								com o direito constitucional à privacidade e com
								o Código Civil. Pode pedir-nos para:
							</p>
							<ul>
								<li>ver que dados temos sobre si;</li>
								<li>
									corrigir dados errados ou desactualizados;
								</li>
								<li>
									apagar a conta ou dados, quando não houver
									dever legal de os manter;
								</li>
								<li>
									limitar ou opor-se a certos usos, dentro do
									que for razoável para o funcionamento do
									serviço;
								</li>
								<li>
									retirar um consentimento dado antes, sem
									afectar o que já foi feito de forma lícita.
								</li>
							</ul>
							<p>
								<strong>Como pedir:</strong> envie email para{' '}
								<a href='mailto:ola@zuka.co.mz'>
									ola@zuka.co.mz
								</a>{' '}
								com o assunto «Privacidade». Podemos pedir prova
								de identidade antes de responder. Como ainda não
								existe uma Autoridade Nacional de Protecção de
								Dados Pessoais a quem recorrer, se não ficar
								satisfeito com a nossa resposta pode procurar
								aconselhamento jurídico ou recorrer aos
								tribunais moçambicanos comuns.
							</p>
						</>
					),
				},
				{
					id: 'cookies',
					title: 'Cookies e armazenamento local',
					content: (
						<>
							<p>
								Usamos cookies e armazenamento local{' '}
								<strong>essenciais</strong> para login, sessão e
								funcionamento correcto do Zuka. Sem eles, partes
								do serviço deixam de funcionar.
							</p>
							<p>
								Podemos usar métricas agregadas (sem o
								identificar) para melhorar o desempenho. Se
								forem precisos cookies não essenciais, pediremos
								o seu consentimento antes de os activar.
							</p>
						</>
					),
				},
				{
					id: 'menores',
					title: 'Menores de idade',
					content: (
						<>
							<p>
								O Zuka destina-se a quem pode celebrar contratos
								em Moçambique, nos termos do Código Civil. Não
								recolhemos de propósito dados de menores sem
								autorização do representante legal. Se souber de
								um registo indevido, contacte-nos para
								removê-lo.
							</p>
						</>
					),
				},
				{
					id: 'alteracoes',
					title: 'Quando esta política mudar',
					content: (
						<>
							<p>
								Podemos actualizar esta página. A data no topo
								mostra a versão actual. Mudanças importantes
								(incluindo a entrada em vigor da nova Lei de
								Protecção de Dados Pessoais em Moçambique) podem
								ser anunciadas no Zuka ou por email. Se
								continuar a usar o serviço depois da publicação,
								aceita a versão revista.
							</p>
						</>
					),
				},
			]}
		/>
	)
}
