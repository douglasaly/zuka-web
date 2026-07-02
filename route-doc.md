# API Routes Documentation

Este arquivo consolida a documentação das rotas da API do projeto, com foco nas rotas presentes em src/app/api. A intenção é servir como referência rápida para desenvolvimento, manutenção e integração frontend.

## Convenções gerais

- As rotas usam o App Router do Next.js e exportam handlers nomeados: GET, POST, PATCH, DELETE.
- A maioria das rotas depende de autenticação via getSessionUser(), requireAdminUser() ou requireSellerStore().
- O acesso a dados é feito via cliente Supabase admin em src/lib/supabase/admin.
- Rotas de autenticação usam Firebase Admin para validar tokens e cookies de sessão.

## Inventário rápido

| Rota | Métodos | Autenticação | Resumo |
| --- | --- | --- | --- |
| /api/auth/register | POST | Nenhuma | Valida token Firebase, cria/sincroniza usuário no Supabase |
| /api/auth/session | POST | Nenhuma | Cria cookie de sessão |
| /api/auth/me | GET | Sessão | Retorna usuário autenticado a partir do cookie |
| /api/auth/logout | POST | Sessão | Remove cookie de sessão |
| /api/me/profile | GET | Sessão | Retorna perfil completo do usuário, lojas e onboarding |
| /api/categories | GET, POST | GET: pública; POST: admin | Lista ou cria categorias |
| /api/provinces | GET | Pública | Lista províncias |
| /api/products | GET, POST | GET: pública; POST: seller | Lista produtos públicos ou cria produto da loja |
| /api/products/[id] | GET | Pública | Retorna detalhes de um produto |
| /api/stores | GET, POST | GET: pública; POST: seller | Lista lojas ou cria nova loja |
| /api/stores/[slug] | GET | Pública | Retorna detalhes de uma loja e seus produtos |
| /api/stores/[slug]/products | GET | Pública | Lista produtos paginados de uma loja |
| /api/stores/[slug]/follow | POST, DELETE | Sessão | Segue ou deixa de seguir uma loja |
| /api/stores/[slug]/is-following | GET | Opcional | Informa se o usuário atual segue a loja |
| /api/stores/followed | GET | Sessão | Lista lojas seguidas pelo usuário |
| /api/saved-items | GET | Sessão | Lista produtos salvos |
| /api/saved-items/[id] | POST, DELETE | Sessão | Salva ou remove produto dos salvos |
| /api/orders | GET | Sessão | Lista pedidos do comprador |
| /api/orders/[id] | GET | Sessão | Detalhes de um pedido do comprador |
| /api/messages | GET | Sessão | Lista mensagens do usuário |
| /api/messages/conversations | GET | Sessão | Lista conversas do usuário |
| /api/messages/[conversationId] | GET | Sessão | Busca mensagens agrupadas por conversa |
| /api/notifications | GET, PATCH | Sessão | Lista notificações e marca como lidas |
| /api/uploads/presign | POST | Sessão | Gera URL assinada para upload de imagem |
| /api/onboarding/role | POST | Sessão | Define papel do usuário no onboarding |
| /api/onboarding/verification | POST | Seller | Submete documentos de verificação |
| /api/seller/store | PATCH | Seller | Atualiza dados da loja e onboarding |
| /api/seller/products | GET | Seller | Lista produtos da loja do seller |
| /api/seller/orders | GET | Seller | Lista pedidos recebidos pela loja do seller |
| /api/admin/categories | GET, POST, PATCH, DELETE | Admin | Gestão de categorias |
| /api/admin/products | GET | Admin | Lista produtos para administração |
| /api/admin/products/[id] | PATCH, DELETE | Admin | Atualiza ou remove produto |
| /api/admin/stores | GET | Admin | Lista lojas para moderação |
| /api/admin/stores/[id] | GET, PATCH, DELETE | Admin | Detalhes, aprovação e remoção de loja |
| /api/admin/users | GET | Admin | Lista usuários |
| /api/admin/users/[id] | GET, PATCH, DELETE | Admin | Detalhes e gestão de usuário |
| /api/admin/analytics | GET | Admin | Estatísticas de crescimento e aprovação |
| /api/admin/stats | GET | Admin | KPIs do painel admin |
| /api/admin/notifications | GET, POST | Admin | Lista e envia notificações em lote |

## Documentação por rota

### /api/auth/register
- Método: POST
- Autenticação: nenhuma
- Corpo esperado: { token: string }
- Comportamento: valida o token Firebase com Firebase Admin, sincroniza o usuário em users do Supabase e devolve dados básicos do perfil.
- Resposta: { success, user }
- Erros: 401 em caso de token inválido ou falha de sincronização.

### /api/auth/session
- Método: POST
- Autenticação: nenhuma
- Corpo esperado: { token: string }
- Comportamento: cria o cookie de sessão do usuário.
- Resposta: { status: 'login success.' }
- Erros: 401 se não for possível criar a sessão.

### /api/auth/me
- Método: GET
- Autenticação: via cookie de sessão
- Comportamento: lê o cookie, valida com Firebase Admin e retorna o usuário correspondente no Supabase.
- Resposta: { user }
- Erros: 401 para sessão ausente; 500 para erro interno.

### /api/auth/logout
- Método: POST
- Autenticação: sessão
- Comportamento: remove o cookie de sessão.
- Resposta: { success: true }

### /api/me/profile
- Método: GET
- Autenticação: sessão
- Comportamento: retorna perfil completo do usuário, roles, perfil de seller, lojas associadas e estado do onboarding.
- Resposta: { success, profile }
- Erros: 401 se não houver sessão; 500 em falha ao carregar.

### /api/categories
- Métodos: GET, POST
- Autenticação: GET pública; POST admin
- GET: lista categorias ordenadas por nome.
- POST: cria uma categoria com id gerado, nome e slug.
- Erros: 400 para payload inválido; 500 para falha de banco.

### /api/provinces
- Método: GET
- Autenticação: pública
- Comportamento: lista províncias.

### /api/products
- Métodos: GET, POST
- Autenticação: GET pública; POST requer seller com loja vinculada
- GET: lista produtos visíveis, ativos e não deletados, agrupando por loja e aplicando filtro por categoria e pesquisa.
- POST: cria um produto, gera slug, registra estoque, insere imagem principal e marca produto como ativo.
- Erros: 400 para dados inválidos; 500 para falha ao salvar.

### /api/products/[id]
- Método: GET
- Autenticação: pública
- Comportamento: busca um produto por id, retornando producto, loja, categoria e imagens.
- Erros: 400 se id não for informado; 404 se não existir; 500 em falha.

### /api/stores
- Métodos: GET, POST
- Autenticação: GET pública; POST requer seller
- GET: lista lojas com contagem de produtos e seguidores, aplicando filtro por busca.
- POST: cria uma nova loja para o seller autenticado, validando permissões e dados básicos.

### /api/stores/[slug]
- Método: GET
- Autenticação: pública
- Comportamento: busca uma loja pelo slug e seus produtos, com paginação e filtro por categoria.
- Resposta: { success, data: { store, products, page, limit } }
- Erros: 404 se Store não existir; 500 em falha de consulta.

### /api/stores/[slug]/products
- Método: GET
- Autenticação: pública
- Comportamento: retorna produtos paginados de uma loja com cursor, incluindo imagem principal e categoria.
- Resposta: { success, data, metadata, pagination }

### /api/stores/[slug]/follow
- Métodos: POST, DELETE
- Autenticação: sessão
- POST: segue uma loja, usando upsert por user_id + store_id.
- DELETE: remove a relação de follow.
- Erros: 401 se desautenticado; 404 se loja não existir; 500 em falha.

### /api/stores/[slug]/is-following
- Método: GET
- Autenticação: opcional
- Comportamento: responde se o usuário atual segue a loja.
- Resposta: { isFollowing }

### /api/stores/followed
- Método: GET
- Autenticação: sessão
- Comportamento: lista lojas seguidas pelo usuário, com paginação por cursor.
- Resposta: { data, metaData }

### /api/saved-items
- Método: GET
- Autenticação: sessão
- Comportamento: lista produtos salvos pelo usuário, incluindo nome da loja e imagem principal.

### /api/saved-items/[id]
- Métodos: POST, DELETE
- Autenticação: sessão
- POST: salva um produto para o usuário. Se já estiver salvo, retorna 409.
- DELETE: remove o item salvo pelo id.

### /api/orders
- Método: GET
- Autenticação: sessão
- Comportamento: lista pedidos do comprador autenticado, mapeando dados para o formato de UI.

### /api/orders/[id]
- Método: GET
- Autenticação: sessão
- Comportamento: retorna detalhes de um pedido específico do comprador.
- Resposta: { success, order, storeSlug, items }

### /api/messages
- Método: GET
- Autenticação: sessão
- Comportamento: lista mensagens do usuário autenticado com cursor de paginação.

### /api/messages/conversations
- Método: GET
- Autenticação: sessão
- Comportamento: lista conversas do usuário com dados resumidos para inbox.

### /api/messages/[conversationId]
- Método: GET
- Autenticação: sessão
- Comportamento: busca mensagens agrupadas por conversa.

### /api/notifications
- Métodos: GET, PATCH
- Autenticação: sessão
- GET: retorna notificações do usuário com count de não lidas e paginação.
- PATCH: marca notificações específicas como lidas.
- Erros: 400 se ids estiverem vazios; 500 em falha.

### /api/uploads/presign
- Método: POST
- Autenticação: sessão
- Comportamento: valida propósito do upload, tipo de imagem e gera uma URL de upload assinada para Cloudflare R2.
- Erros: 400 para propósito ou tipo inválido; 500 para falha ao preparar upload.

### /api/onboarding/role
- Método: POST
- Autenticação: sessão
- Comportamento: define o papel do usuário como buyer ou seller e cria o seller profile quando necessário.

### /api/onboarding/verification
- Método: POST
- Autenticação: seller
- Comportamento: grava documentos de verificação e atualiza o status do onboarding para submitted.

### /api/seller/store
- Método: PATCH
- Autenticação: seller
- Comportamento: atualiza logo, banner, descrição, telefone, WhatsApp e estado do onboarding da loja do seller.

### /api/seller/products
- Método: GET
- Autenticação: seller
- Comportamento: lista produtos da loja vinculada ao seller autenticado.

### /api/seller/orders
- Método: GET
- Autenticação: seller
- Comportamento: lista pedidos recebidos pelas lojas do seller autenticado.

### /api/admin/categories
- Métodos: GET, POST, PATCH, DELETE
- Autenticação: admin
- Comportamento: CRUD de categorias.

### /api/admin/products
- Método: GET
- Autenticação: admin
- Comportamento: lista produtos com filtros por busca, categoria e status, incluindo informações da loja e categoria.

### /api/admin/products/[id]
- Métodos: PATCH, DELETE
- Autenticação: admin
- PATCH: atualiza campos do produto.
- DELETE: soft delete do produto.

### /api/admin/stores
- Método: GET
- Autenticação: admin
- Comportamento: lista lojas com contagem de produtos e seguidores, filtrando por status ou busca.

### /api/admin/stores/[id]
- Métodos: GET, PATCH, DELETE
- Autenticação: admin
- GET: retorna detalhes completos da loja, documentos de verificação e produtos recentes.
- PATCH: atualiza dados da loja, status e onboarding.
- DELETE: soft delete da loja.

### /api/admin/users
- Método: GET
- Autenticação: admin
- Comportamento: lista usuários com roles e relacionamento com loja, com filtros por busca e status.

### /api/admin/users/[id]
- Métodos: GET, PATCH, DELETE
- Autenticação: admin
- PATCH: concede/remover role admin, atualiza status.
- DELETE: soft delete do usuário.

### /api/admin/analytics
- Método: GET
- Autenticação: admin
- Comportamento: retorna séries temporais de cadastros e aprovação de lojas, além dos top stores.

### /api/admin/stats
- Método: GET
- Autenticação: admin
- Comportamento: retorna KPIs do painel admin com comparação percentual contra períodos anteriores.

### /api/admin/notifications
- Métodos: GET, POST
- Autenticação: admin
- GET: lista notificações agrupadas por lote.
- POST: envia notificações para buyers, sellers ou todos os usuários.

## Pontos de atenção

- Algumas rotas usam soft delete via deleted_at em vez de remoção física.
- Em rotas de seller/admin, a checagem de permissão acontece antes do acesso ao banco.
- Ao criar novas rotas, seguir o padrão de resposta JSON com status HTTP explícito e autenticação centralizada.
