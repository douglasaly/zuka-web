# Plano de Implementação — Dashboard Seller

> Auditoria vs código: **18 Ago 2026**. Check = aplicado no projecto. Itens parciais ficam por fazer, com nota.

## Legenda

- `[ ]` Pendente
- `[x]` Concluído

---

## Fase 0 — Fundação ✅

_Estrutura antes das features._

- [x] Adicionar `loading.tsx` e `error.tsx` em `/dashboard/seller/`
- [x] Adicionar `loading.tsx` e `error.tsx` em `/dashboard/` (root)
- [x] Criar `src/modules/seller/ui/layouts/seller-top-bar.tsx` (breadcrumbs + "Ver como comprador" + notificações)
- [x] Adicionar seller-top-bar ao `seller-layout.tsx`
- [x] Padronizar pasta `layouts/` (plural)
- [x] Adicionar `not-found.tsx` em `/dashboard/seller/` e `/dashboard/`

---

## Fase 1 — Sidebar + Rotas

_Expandir navegação e criar páginas._

- [x] Sidebar com itens agrupados (hoje: 3 grupos, 8 itens + footer; filtrado por permissões)
- [x] Rota `/dashboard/seller/pedidos/page.tsx`
- [x] Rota `/dashboard/seller/pedidos/[id]/page.tsx`
- [x] Rota `/dashboard/seller/mensagens/page.tsx`
- [x] Rota `/dashboard/seller/mensagens/[id]/page.tsx`
- [x] Rota `/dashboard/seller/loja/page.tsx`
- [x] Rota `/dashboard/seller/loja/membros/page.tsx`
- [x] Rota `/dashboard/seller/produtos/page.tsx`
- [x] Rota `/dashboard/seller/produtos/novo/page.tsx`
- [x] Rota `/dashboard/seller/produtos/[id]/editar/page.tsx`
- [x] Rota `/dashboard/seller/produtos/categorias/page.tsx`
- [x] Rota `/dashboard/seller/avaliacoes/page.tsx`
- [ ] Rota `/dashboard/seller/analytics/page.tsx` activa — o ficheiro existe mas chama `notFound()`; `SellerAnalyticsView` não está ligada
- [x] Rota `/dashboard/seller/configuracoes/page.tsx`

### 🧱 O que foi construído

| Ficheiro | Tipo | Responsabilidade |
|---|---|---|
| `seller-sidebar.tsx` | Componente | 3 grupos (Principal / Loja / Configurações), badges (pendingOrders, unreadMessages), Membros, "Ver como comprador" |
| `product-form.tsx` | Componente | Formulário partilhado (`create`/`edit`), categorias, imagens múltiplas, preview Sheet, validação |
| `seller-orders-view.tsx` | View | Lista de pedidos, empty state, skeleton, search, filtros status/data |
| `seller-order-detail-view.tsx` | View | Detalhe do pedido + acções reais (envio / entregue / cancelar) |
| `seller-messages-view.tsx` | View | Inbox: pesquisa, filtro não lidas, paginação, empty/error |
| `seller-conversation-view.tsx` | View | Chat + rail de inbox, bolhas, send, Enter, auto-scroll, marcar lida |
| `seller-store-view.tsx` | View | Editor completo da loja (Fase 7) |
| `seller-products-view.tsx` | View | Lista com search, filtros status/categoria/preço, bulk, preview |
| `seller-new-product-view.tsx` | View | Wrapper loja → `ProductForm` (create) |
| `seller-edit-product-view.tsx` | View | Fetch produto → `ProductForm` (edit) |
| `seller-categories-view.tsx` | View | CRUD + reordenar categorias |
| `seller-reviews-view.tsx` | View | API real: média, distribuição, loja vs produto, responder |
| `seller-analytics-view.tsx` | View | KPI + tendência — **órfã** (página devolve 404) |
| `seller-settings-view.tsx` | View | Destinos (loja, membros, password) + prefs + zona de perigo |
| `seller-members-view.tsx` | View | Equipe, convite por email, roles |
| `products/[id]/route.ts` | API | `GET` + `PATCH` + `DELETE` (valida store_id) |

### 🔧 O que pode ser melhorado

1. **Sidebar** — Incluir **Desempenho** (`/analytics`) quando a rota for reactivada. Categorias só aparecem a partir de Produtos.
2. **Inbox split-view** — Em `/mensagens` o painel direito é placeholder ("Seleccione uma conversa"); o chat só abre em `/mensagens/[id]`. No desktop, abrir a conversa inline na mesma página.
3. **`seller-analytics-view`** — Ligar a view à página e à sidebar; deixar de devolver `notFound()`.
4. **`product-form`** — Preview local da imagem **antes** do upload (hoje faz upload imediato para R2). Variações (tamanho/cor) ainda não existem no schema.
5. **Atalhos** — Restaurar `A` → analytics; documentar `P` produtos (não pedidos).

### ✨ Adições (hooks / API / membros)

| Ficheiro | Tipo | O que faz |
|---|---|---|
| `hooks/use-shortcut.ts` | Hook | Atalhos: `P` produtos, `O` pedidos, `M` mensagens, `N` novo produto — ignorados em inputs. **Sem `A` analytics.** |
| `hooks/use-unread-counts.ts` | Hook | Polling `/api/seller/unread-counts` a cada 30s |
| `hooks/use-notification-push.ts` | Hook | `Notification` API quando pendingOrders / unreadMessages sobem — **não lê** as prefs das configurações |
| `api/seller/unread-counts/route.ts` | API | Pedidos pendentes + conversas não lidas |
| `api/seller/products/bulk/route.ts` | API | Bulk `delete` / `activate` / `deactivate` |
| `api/seller/members/route.ts` | API | `GET` membros, `POST` convite por email + role |
| `api/seller/members/[id]/route.ts` | API | `PATCH` role, `DELETE` membro |
| `layouts/seller-layout-client.tsx` | Client | Injecta shortcuts + push sem quebrar o layout server |
| `views/seller-members-view.tsx` | View | Lista Equipe + modal de convite |
| `migrations/20250710090000_store_members.sql` | SQL | Tabela `store_members` UNIQUE(store_id, user_id) |

---

## Fase 2 — API Layer ✅ (analytics ainda mock)

_Endpoints reais para substituir mocks._

- [x] `GET /api/seller/stats` — KPIs com comparativo (sales, orders, followers, products; range)
- [x] `GET /api/seller/stats/daily` — série temporal de vendas (usada no Resumo)
- [x] `GET /api/seller/stats/top-products` — top produtos (limit 1–10, usada no Resumo)
- [x] `GET /api/seller/stats/analytics` — **existe mas devolve `mock: true`** (`getMockSellerAnalytics`)
- [x] `GET /api/seller/reviews` — avaliações da loja + produtos, search, needsReply
- [x] `POST /api/seller/reviews/[id]/reply` — resposta da loja
- [x] `POST /api/seller/products/bulk` — bulk delete/activate/deactivate
- [x] `GET /api/seller/notifications` — notificações do seller
- [x] `PATCH /api/seller/notifications` — marcar como lida (batch)
- [x] `GET /api/seller/unread-counts` — badges sidebar
- [x] `GET /api/seller/members` + `POST` — listar/convidar
- [x] `PATCH` + `DELETE /api/seller/members/[id]` — role e remoção
- [x] `GET /api/seller/orders` com filtros (status, date, page, limit)
- [x] `GET` + `PATCH /api/seller/orders/[id]` — detalhe + transições de status
- [x] Estender `GET /api/seller/products` com filtros (search, status, category, preço, page, limit)
- [x] `GET /api/stores/conversations` — inbox da loja
- [x] `GET /api/stores/conversations/[id]/messages` — mensagens
- [x] `POST /api/stores/conversations/[id]/messages` — enviar como loja
- [x] `PATCH /api/stores/conversations/[id]/read` — marcar lida

### 🔧 O que pode ser melhorado

1. Substituir mock em `/api/seller/stats/analytics` por agregação real (reutilizar `/stats` + `/stats/daily` + vistas quando houver tracking).
2. `POST /api/seller/reviews/[id]/report` (ou flag) para denunciar review imprópria.
3. Tracking de vistas / visitantes únicos da loja e produtos (necessário para analytics de tráfego).
4. Preferências de notificação persistidas na BD (hoje só `localStorage`), e respeitadas em `useNotificationPush`.

---

## Fase 3 — Dashboard Principal

_Transformar a página inicial do seller._

- [x] Welcome banner real (nome da loja da BD)
- [x] KPI cards ligados à API (`GET /api/seller/stats`; `MOCK_SELLER_STATS` já não é usado na view)
- [x] Quick actions: "Novo produto", "Ver pedidos", "Partilhar loja", "Editar loja"
- [x] Tab "Resumo": últimos 5 pedidos, top 5 produtos, gráfico area vendas (7d / 14d / 30d)
- [ ] Feed de actividade no Resumo (pedidos + mensagens + avaliações recentes)
- [x] Tab "Produtos" ligada à API (lista resumida)
- [x] Tab "Pedidos" funcional (tabela + filtros + acções via `SellerOrdersSection`)
- [x] Loading skeleton da página (`SellerDashboardSkeleton`)
- [x] Empty states com ícone + CTA (não ilustração custom)

### 🔧 O que pode ser melhorado

1. Tab por defeito é **"Produtos"** — mudar para **"Resumo"** como ecrã de aterragem.
2. Tab Produtos: `onAdd` / `onDelete` são no-ops; editar usa `window.location.href`. Ligar a `/produtos/novo`, mutação de delete e `router.push`.
3. Cards do Resumo e quick actions usam `bg-white` / `bg-neutral-900` hardcoded — falham no modo escuro.
4. Remover `MOCK_SELLER_STATS` / `MOCK_SELLER_PRODUCTS` mortos em `src/modules/seller/constants.ts`.
5. Feed de actividade (timeline) no Resumo.
6. Empty states com ilustração (hoje só ícone Lucide + texto).

---

## Fase 4 — Pedidos ✅

_Gestão completa de pedidos._

- [x] Lista com produto, cliente, valor, data, status colorido
- [x] Filtros: todos / pendentes / em envio / entregue / cancelado (enum: PENDING → SHIPPING → COMPLETED; CANCELLED)
- [x] Acções: marcar em envio, marcar entregue, cancelar (confirmação + ownership no backend)
- [x] Detail view em Sheet: cliente, produtos, histórico de status
- [x] Badge de pedidos pendentes no sidebar
- [x] Notificação browser para novo pedido/mensagem (`useNotificationPush`)
- [x] Ao marcar entregue: `review_eligible` + notificação `review` ao comprador
- [x] Página de detalhe `/pedidos/[id]` com as mesmas acções

Fluxo linear (sem saltar etapas): **Pendente → Em envio → Entregue**. Cancelar só a partir de Pendente ou Em envio.

---

## Fase 5 — Produtos ✅

_Gestão completa de produtos (páginas próprias)._

- [x] Lista com imagem, nome, preço, status, categorias
- [x] Filtros: categoria, status, preço, search
- [x] Bulk actions: pausar, activar, eliminar seleccionados
- [x] Novo produto: nome, descrição, categoria, preço, imagens múltiplas, status
- [x] Editar produto: pré-preenchido, mesma estrutura
- [x] Pré-visualização em Sheet
- [x] Gestão de categorias: criar, editar, reordenar

### 🧱 O que foi construído

| Ficheiro | Tipo | Responsabilidade |
|---|---|---|
| `api/seller/products/route.ts` | API | Lista com filtros preço/categoria/status/search |
| `api/seller/products/[id]/route.ts` | API | `GET` detalhe + `PATCH` multi-imagens/status |
| `api/seller/categories/route.ts` | API | CRUD + reordenar categorias |
| `product-editor/*` | Components | Imagens múltiplas, status, preview Sheet |
| `product-form.tsx` | Form | Layout 2 colunas create/edit |
| `seller-products-view.tsx` | View | Lista + filtros preço + preview |
| `seller-categories-view.tsx` | View | Criar/editar/reordenar/eliminar |
| `migrations/20250730120000_categories_position.sql` | SQL | Coluna `position` em categories |

### 🔧 O que pode ser melhorado

1. Variações de produto (tamanho / cor / stock por variante) — não há tabela nem UI.
2. Preview local antes do upload (ver Fase 1).
3. Duplicar produto; rascunho vs publicado mais explícito no fluxo.

### ⚠️ Migração

Correr `supabase/migrations/20250730120000_categories_position.sql` antes de usar reordenação de categorias.

---

## Fase 6 — Mensagens ✅ (realtime ainda em falta)

_Chat com clientes._

- [x] Lista de conversas: avatar, nome, última mensagem, timestamp, badge não lidas
- [x] Chat: bolhas, input com Enter, timestamp, carregar mensagens antigas
- [x] Página dedicada `/mensagens/[id]` (rail de inbox + thread); lista em `/mensagens`
- [x] Badge de mensagens não lidas no sidebar (polling 30s)
- [x] Auto-scroll ao abrir / ao enviar
- [x] Marcar conversa como lida (`PATCH .../read`)

### 🔧 O que pode ser melhorado

1. **Tempo real** — sem WebSocket, Supabase Realtime ou polling da thread; o vendedor só vê mensagens novas após refresh / re-fetch no send.
2. Split-view no ecrã de lista (ver Fase 1).
3. Anexos (imagem) e estado "a escrever…".
4. Respeitar prefs de notificação (mensagens on/off) no push do browser.

---

## Fase 7 — Minha Loja ✅

_Perfil e configurações da loja._

- [x] Logo upload (preview + crop)
- [x] Banner upload
- [x] Nome, slug, descrição (textarea simples, máx. 800 — **não** é rich text)
- [x] Telefone, WhatsApp
- [x] Morada / localização
- [x] Configurações de entrega: zonas, preço, tempo estimado
- [x] Documentos: status verificação, re-envio
- [x] Status da loja: activo / pausado / fechado

### 🧱 O que foi construído

| Ficheiro | Tipo | Responsabilidade |
|---|---|---|
| `api/seller/store/route.ts` | API | `GET` loja + docs; `PATCH` identidade, media, contactos, localização, entrega, status |
| `api/seller/store/documents/route.ts` | API | `POST` reenvio de documentos |
| `api/seller/store/map-store.ts` | Mapper | Normaliza store + documents |
| `store-editor/*` | Components | Hero, media (+crop), identidade, contactos, localização, entrega, status, documentos |
| `store-editor-form.tsx` | Form | Estado, save sticky bar, toasts |
| `seller-store-view.tsx` | View | Fetch `/api/seller/store` → form |
| `migrations/20250730100000_store_delivery_settings.sql` | SQL | `has_delivery`, `delivery_fee`, `delivery_eta_minutes`, `delivery_zones` |

### 🔧 O que pode ser melhorado

1. Editor rich da descrição (hoje textarea plain).
2. Slug editável (hoje está `disabled`).
3. Preview pública ao vivo ao lado do formulário.

---

## Fase 8 — Analytics

_Relatórios e gráficos. UI existe em `SellerAnalyticsView`, mas a rota está desligada._

- [ ] Reactivar `/dashboard/seller/analytics` (deixar de chamar `notFound()`) e item na sidebar
- [x] Range picker UI: 7d / 30d / 90d
- [ ] Range personalizado (from / to)
- [x] KPI cards UI (vendas, pedidos, vistas, produtos activos, seguidores)
- [ ] KPI ticket médio e taxa de conversão (o plano original; a view actual não os tem)
- [ ] Ligar KPIs / tendência a dados reais (API devolve mock + banner "dados de exemplo")
- [ ] Gráfico vendas (area chart por dia) **nesta página** — o area chart real está só no Resumo via `/stats/daily`
- [ ] Gráfico pedidos (bar chart por dia)
- [ ] Top 10 produtos mais vendidos nesta página (`/stats/top-products` já existe)
- [ ] Tráfego: visualizações vs visitantes únicos (falta tracking)
- [ ] Download relatório (CSV)

O Resumo do dashboard já cobre uma fatia disto (vendas diárias reais + top 5). A página Dedicada de Desempenho ainda é um stub.

---

## Fase 9 — Avaliações ✅ (denúncia em falta)

- [x] Lista de reviews: cliente, produto, rating, comentário, data (API real, sem mock)
- [x] Responder a review da **loja** (inline → `POST /api/seller/reviews/:id/reply`)
- [ ] Responder a review de **produto** (cards de produto são só leitura)
- [ ] Denunciar review imprópria
- [x] Estatísticas: média geral, distribuição 1–5 (loja e produtos)
- [x] Filtros: âmbito loja/produto, pesquisa, "precisa de resposta"

---

## Fase 10 — Configurações

- [x] Preferências de notificação por tópico (pedidos, mensagens, avaliações) — só neste dispositivo (`localStorage`)
- [ ] Canais email / push / som (o plano original); prefs ainda não afectam `useNotificationPush`
- [x] Alterar palavra-passe (link para `/perfil/definicoes/seguranca/palavra-passe`)
- [x] Gerir membros da loja (convidar por email, roles owner / manager / staff / viewer; PATCH role; remover)
- [x] Eliminar **conta e loja** (dialog de confirmação → `POST /api/auth/delete-account`)
- [ ] Eliminar **só a loja** (manter a conta de comprador), com confirmação forte (escrever o nome da loja)

---

## Fase 11 — Polimento UX/UI

_Tornar tudo espectacular._

- [ ] Micro-interacções consistentes (hover/focus/transição em todos os ecrãs; vários já têm `transition-colors`)
- [ ] Modo escuro consistente — vários blocos do dashboard usam `bg-white` / `text-neutral-900`
- [x] Mobile: menu drawer (`SidebarTrigger` no top-bar, `md:hidden`)
- [ ] Mobile: bottom nav para atalhos (Dashboard / Pedidos / Mensagens / Produtos)
- [x] Animações de loading (spinners, pulsing skeletons)
- [x] Toasts de sucesso/erro nas acções principais (pedidos, produtos, loja, reviews, membros, chat)
- [x] Keyboard shortcuts: `N` novo produto, `P` produtos, `O` pedidos, `M` mensagens
- [ ] Shortcut `A` analytics (quando a rota existir)
- [x] Badges em tempo quase-real no sidebar (polling 30s)

---

## Prioridades seguintes (ordenado)

1. Reactivar Desempenho (página + sidebar + dados reais) ou remover a rota morta até haver tracking.
2. Inbox split-view no desktop + polling/realtime da thread.
3. Resumo como tab inicial + feed de actividade; corrigir handlers mortos da tab Produtos.
4. Ligar prefs de notificação ao push; persistir no servidor.
5. Denúncia de reviews + resposta a reviews de produto.
6. Dark mode nos ecrãs do dashboard (`bg-white` → `bg-card`).
7. Variações de produto e CSV de analytics — depois do núcleo acima.

---

## Timeline Estimada

```
Fase 0:  Fundação        ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias ✅
Fase 1:  Sidebar + Rotas ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜  ~3 dias (analytics 404)
Fase 2:  API Layer       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~3 dias ✅ (analytics mock)
Fase 3:  Dashboard       ⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜  ~3 dias (feed + tab produtos)
Fase 4:  Pedidos         ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias ✅
Fase 5:  Produtos        ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~3 dias ✅
Fase 6:  Mensagens       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜  ~2 dias (falta realtime)
Fase 7:  Minha Loja      ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias ✅
Fase 8:  Analytics       ⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  ~2 dias (view órfã + mock)
Fase 9:  Avaliações      ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜  ~1 dia (falta denúncia)
Fase 10: Configurações   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜  ~1 dia (prefs locais)
Fase 11: Polimento UX    ⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜  ~2 dias (dark + mobile nav)
                                  Restante estimado: ~8–10 dias
```
