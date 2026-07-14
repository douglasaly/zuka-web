# Plano de Implementação — Dashboard Seller

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

## Fase 1 — Sidebar + Rotas ✅

_Expandir navegação e criar páginas._

- [x] Sidebar expandido com itens agrupados
- [x] Rota `/dashboard/seller/pedidos/page.tsx`
- [x] Rota `/dashboard/seller/pedidos/[id]/page.tsx`
- [x] Rota `/dashboard/seller/mensagens/page.tsx`
- [x] Rota `/dashboard/seller/mensagens/[id]/page.tsx`
- [x] Rota `/dashboard/seller/loja/page.tsx`
- [x] Rota `/dashboard/seller/produtos/page.tsx`
- [x] Rota `/dashboard/seller/produtos/novo/page.tsx`
- [x] Rota `/dashboard/seller/produtos/[id]/editar/page.tsx`
- [x] Rota `/dashboard/seller/produtos/categorias/page.tsx`
- [x] Rota `/dashboard/seller/avaliacoes/page.tsx`
- [x] Rota `/dashboard/seller/analytics/page.tsx`
- [x] Rota `/dashboard/seller/configuracoes/page.tsx`

### 🧱 O que foi construído

| Ficheiro | Tipo | Responsabilidade |
|---|---|---|
| `seller-sidebar.tsx` | Componente | 4 grupos, 13 items, badges tempo real (pendingOrders, unreadMessages), link "Membros" |
| `product-form.tsx` | Componente | Formulário partilhado (`create`/`edit`), categorias via hook, upload imagem, validação |
| `seller-orders-view.tsx` | View | Lista de pedidos, empty state, loading skeleton, search, filtros status/data |
| `seller-order-detail-view.tsx` | View | Detalhe do pedido, info card, acções placeholder |
| `seller-messages-view.tsx` | View | Lista de conversas, badge não lidas, preview última msg |
| `seller-conversation-view.tsx` | View | Chat inline, bolhas cliente/loja, send message, Enter key |
| `seller-store-view.tsx` | View | Perfil loja (nome, slug, status, produtos), link para registo |
| `seller-products-view.tsx` | View | Lista com search, filtros status/categoria, selecção múltipla, toolbar bulk (activar/desactivar/eliminar) |
| `seller-new-product-view.tsx` | View | Wrapper que verifica loja → delega para `ProductForm` (create) |
| `seller-edit-product-view.tsx` | View | Fetch produto por ID → delega para `ProductForm` (edit) |
| `seller-categories-view.tsx` | View | Lista hierárquica de categorias com subcategorias aninhadas |
| `seller-reviews-view.tsx` | View | Média, distribuição 1‑5, lista de reviews, responder (mock data c/ fallback) |
| `seller-analytics-view.tsx` | View | 6 KPI cards, range selector 7d/30d/90d |
| `seller-settings-view.tsx` | View | 4 cards (notificações, loja, segurança, encerrar) |
| `products/[id]/route.ts` | API | `PATCH` + `DELETE` para produtos do vendedor (valida store_id) |
| `seller-sidebar.tsx` | — | Itens agrupados com `SidebarGroupLabel` |

### 🔧 O que pode ser melhorado

1. **`seller-orders-view`** — Criar `GET /api/seller/orders/[id]` para o detail view funcionar com dados reais (hoje faz fetch e pode falhar 404)
2. **`seller-conversation-view`** — Auto-scroll para o fim ao carregar/enviar; escuta real-time (WebSocket/polling) para novas mensagens
3. **`seller-store-view`** — Transformar numa página de edição real com form de logo, banner, descrição, WhatsApp, entrega (hoje é read‑only)
4. **`seller-reviews-view`** — Criar `GET /api/seller/reviews` + `POST /api/seller/reviews/:id/reply` para remover mock data
5. **`seller-analytics-view`** — Criar `GET /api/seller/stats/analytics` que a view já espera (hoje retorna 404)
6. **`seller-settings-view`** — Ligar acções "Configurar" e "Alterar" a páginas/modais reais; implementar "Encerrar conta" com confirmação
7. **`product-form`** — Adicionar preview de imagem antes do upload; suporte a múltiplas imagens; variações (tamanho/cor)

### ✨ Adições recentes (Jul 2026)

| Ficheiro | Tipo | O que faz |
|---|---|---|
| `hooks/use-shortcut.ts` | Hook | Atalhos de teclado globais (`P` produtos, `O` pedidos, `M` mensagens, `A` analytics, `N` novo produto) — ignorados em inputs |
| `hooks/use-unread-counts.ts` | Hook | Polling `/api/seller/unread-counts` a cada 30s, react-query cache |
| `hooks/use-notification-push.ts` | Hook | Dispara `Notification` API quando pendingOrders ou unreadMessages sobem |
| `api/seller/unread-counts/route.ts` | API | Conta pedidos pendentes + conversas não lidas do seller (store_id, conversation_participants, messages) |
| `api/seller/products/bulk/route.ts` | API | `POST` bulk com acções `delete`/`activate`/`deactivate` (valida store_id) |
| `api/seller/members/route.ts` | API | `GET` membros da loja (com join users), `POST` convite por userId ou email |
| `layouts/seller-layout-client.tsx` | Componente Client | Injecta `useShortcuts` + `useNotificationPush` sem quebrar server component |
| `views/seller-members-view.tsx` | View | Lista equipa (owner + staff), modal de convite por email com role picker |
| `migrations/20250710090000_store_members.sql` | SQL | Nova tabela `store_members` com UNIQUE(store_id, user_id) |

---

## Fase 2 — API Layer

_Endpoints reais para substituir mocks._

- [x] `GET /api/seller/stats` — KPIs com comparativo (sales, orders, followers, products; range 7d/30d/90d)
- [x] `GET /api/seller/stats/analytics` — dados temporais para gráficos (6 KPI cards)
- [ ] `GET /api/seller/reviews` — avaliações da loja
- [x] `POST /api/seller/products/bulk` — bulk delete/activate/deactivate
- [x] `GET /api/seller/notifications` — notificações do seller (paginação, sender user/store)
- [x] `PATCH /api/seller/notifications` — marcar como lida (batch por ids)
- [x] `GET /api/seller/unread-counts` — contagens tempo real (sidebar badges)
- [x] `GET /api/seller/members` + `POST` — listar/convidar membros da loja
- [x] Estender `GET /api/seller/orders` com filtros (status, date, page, limit) — server-side
- [x] Estender `GET /api/seller/products` com filtros (search, status, category, page, limit) — server-side
- [x] `GET /api/stores/conversations` — inbox da loja (comprador, última msg, não lida)
- [x] `GET /api/stores/conversations/[id]/messages` — mensagens da conversa
- [x] `POST /api/stores/conversations/[id]/messages` — enviar mensagem como loja (com `store_id`)
- [x] `PATCH /api/stores/conversations/[id]/read` — marcar conversa como lida

---

## Fase 3 — Dashboard Principal

_Transformar a página inicial do seller._

- [x] Welcome banner real (nome da loja da BD)
- [x] KPI cards ligados à API (remover `MOCK_SELLER_STATS`)
- [ ] Adicionar KPIs extra: taxa de conversão, produtos activos
- [x] Quick actions row: "Novo produto", "Ver pedidos", "Partilhar loja", "Editar loja"
- [x] Tab "Resumo" com: últimos 5 pedidos, top 5 produtos, gráfico vendas 7d, feed actividade
- [x] Tab "Produtos" ligada à API real
- [x] Tab "Pedidos" funcional (tabela + filtros + acções)
- [x] Loading skeletons em cada tab
- [x] Empty states com ilustração e CTA

---

## Fase 4 — Pedidos

_Gestão completa de pedidos._

- [ ] Lista com produto, cliente, valor, data, status colorido
- [ ] Filtros: todos / pendentes / processando / enviado / entregue / cancelado
- [ ] Acções: confirmar, marcar enviado, cancelar (com confirmação)
- [ ] Detail view em Sheet: cliente, endereço, produtos, histórico de status
- [ ] Badge de pedidos pendentes no sidebar
- [x] Notificação browser para novo pedido/mensagem (através de `useNotificationPush`)

---

## Fase 5 — Produtos

_Gestão completa de produtos (páginas próprias)._

- [ ] Lista com imagem, nome, preço, stock, status, categorias
- [ ] Filtros: categoria, status, preço, search
- [ ] Bulk actions: pausar, activar, eliminar seleccionados
- [ ] Novo produto: nome, descrição, categoria, preço, stock, imagens múltiplas, variações, status
- [ ] Editar produto: pré-preenchido, mesma estrutura
- [ ] Pré-visualização em Sheet
- [ ] Gestão de categorias: criar, editar, reordenar

---

## Fase 6 — Mensagens

_Chat com clientes._

- [ ] Lista de conversas: avatar, nome, última mensagem, timestamp, badge não lidas
- [ ] Chat inline: bolhas, input com enter, timestamp
- [ ] Sheet ou página dedicada para conversa
- [ ] Indicador online/offline do cliente
- [ ] Badge de mensagens não lidas no sidebar (tempo real)

---

## Fase 7 — Minha Loja

_Perfil e configurações da loja._

- [ ] Logo upload (preview + crop)
- [ ] Banner upload
- [ ] Nome, slug, descrição (textarea rich)
- [ ] Telefone, WhatsApp
- [ ] Morada / localização
- [ ] Configurações de entrega: zonas, preço, tempo estimado
- [ ] Documentos: status verificação, re-envio
- [ ] Status da loja: activo / pausado / fechado

---

## Fase 8 — Analytics

_Relatórios e gráficos._

- [ ] Range picker: 7d / 30d / 90d / personalizado
- [ ] KPI cards: vendas, pedidos, ticket médio, taxa conversão
- [ ] Gráfico vendas (area chart por dia)
- [ ] Gráfico pedidos (bar chart por dia)
- [ ] Top 10 produtos mais vendidos
- [ ] Tráfego: visualizações vs visitantes únicos
- [ ] Download relatório (CSV)

---

## Fase 9 — Avaliações

- [ ] Lista de reviews: cliente, produto, rating, comentário, data
- [ ] Responder a review (inline)
- [ ] Denunciar review imprópria
- [ ] Estatísticas: média geral, distribuição estrelas 1-5

---

## Fase 10 — Configurações

- [ ] Preferências de notificação (email, push, som)
- [ ] Alterar palavra-passe
- [x] Gerir membros da loja (convidar por email, roles owner/manager/staff/viewer)
- [ ] Opção de eliminar loja (com confirmação forte)

---

## Fase 11 — Polimento UX/UI

_Tornar tudo espectacular._

- [ ] Micro-interacções: hover, focus, transições suaves
- [ ] Modo escuro consistente
- [ ] Mobile responsive: bottom nav ou drawer
- [x] Animações de loading (spinners, pulsing skeletons)
- [ ] Toasts de sucesso/erro em todas as acções
- [x] Keyboard shortcuts: `N` novo produto, `P` pedidos, `O` pedidos, `M` mensagens, `A` analytics
- [x] Badges em tempo real no sidebar (pedidos pendentes + mensagens não lidas, polling 30s)

---

## Timeline Estimada

```
Fase 0:  Fundação        ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias ✅
Fase 1:  Sidebar + Rotas ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~3 dias ✅
Fase 2:  API Layer       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~3 dias (14/14 endpoints)
Fase 3:  Dashboard       ⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜  ~3 dias
Fase 4:  Pedidos         ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜  ~2 dias (notif push done)
Fase 5:  Produtos        ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜  ~3 dias (bulk done)
Fase 6:  Mensagens       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
Fase 7:  Minha Loja      ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
Fase 8:  Analytics       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
Fase 9:  Avaliações      ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~1 dia
Fase 10: Configurações   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜  ~1 dia (membros done)
Fase 11: Polimento UX    ⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜  ~2 dias (shortcuts + badges done)
                                  Total: ~26 dias
```
