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

## Fase 1 — Sidebar + Rotas

_Expandir navegação e criar páginas._

- [x] Sidebar expandido com itens agrupados
- [x] Rota `/dashboard/seller/pedidos/page.tsx`
- [x] Rota `/dashboard/seller/pedidos/[id]/page.tsx`
- [x] Rota `/dashboard/seller/mensagens/page.tsx`
- [x] Rota `/dashboard/seller/mensagens/[id]/page.tsx`
- [x] Rota `/dashboard/seller/loja/page.tsx`
- [x] Rota `/dashboard/seller/produtos/page.tsx`
- [ ] Rota `/dashboard/seller/produtos/novo/page.tsx`
- [ ] Rota `/dashboard/seller/produtos/[id]/editar/page.tsx`
- [ ] Rota `/dashboard/seller/produtos/categorias/page.tsx`
- [x] Rota `/dashboard/seller/loja/page.tsx`
- [ ] Rota `/dashboard/seller/avaliacoes/page.tsx`
- [ ] Rota `/dashboard/seller/analytics/page.tsx`
- [ ] Rota `/dashboard/seller/configuracoes/page.tsx`

---

## Fase 2 — API Layer

_Endpoints reais para substituir mocks._

- [ ] `GET /api/seller/stats` — KPIs com comparativo
- [ ] `GET /api/seller/stats/analytics` — dados temporais para gráficos
- [ ] `GET /api/seller/reviews` — avaliações da loja
- [ ] `PATCH /api/seller/products/bulk` — bulk pause/activate/delete
- [ ] `GET /api/seller/notifications` — notificações do seller
- [ ] `PATCH /api/seller/notifications` — marcar como lida
- [ ] Estender `GET /api/seller/orders` com filtros (status, data, paginação)
- [ ] Estender `GET /api/seller/products` com filtros (categoria, status, search, paginação)

---

## Fase 3 — Dashboard Principal

_Transformar a página inicial do seller._

- [ ] Welcome banner real (nome da loja da BD)
- [ ] KPI cards ligados à API (remover `MOCK_SELLER_STATS`)
- [ ] Adicionar KPIs extra: taxa de conversão, produtos activos
- [ ] Quick actions row: "Novo produto", "Ver pedidos", "Partilhar loja", "Editar loja"
- [ ] Tab "Resumo" com: últimos 5 pedidos, top 5 produtos, gráfico vendas 7d, feed actividade
- [ ] Tab "Produtos" ligada à API real
- [ ] Tab "Pedidos" funcional (tabela + filtros + acções)
- [ ] Loading skeletons em cada tab
- [ ] Empty states com ilustração e CTA

---

## Fase 4 — Pedidos

_Gestão completa de pedidos._

- [ ] Lista com produto, cliente, valor, data, status colorido
- [ ] Filtros: todos / pendentes / processando / enviado / entregue / cancelado
- [ ] Acções: confirmar, marcar enviado, cancelar (com confirmação)
- [ ] Detail view em Sheet: cliente, endereço, produtos, histórico de status
- [ ] Badge de pedidos pendentes no sidebar
- [ ] Notificação browser para novo pedido

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
- [ ] Gerir membros da loja
- [ ] Opção de eliminar loja (com confirmação forte)

---

## Fase 11 — Polimento UX/UI

_Tornar tudo espectacular._

- [ ] Micro-interacções: hover, focus, transições suaves
- [ ] Modo escuro consistente
- [ ] Mobile responsive: bottom nav ou drawer
- [ ] Animações de loading (spinners, pulsing skeletons)
- [ ] Toasts de sucesso/erro em todas as acções
- [ ] Keyboard shortcuts: `N` novo produto, `P` pedidos, etc.
- [ ] Badges em tempo real no sidebar

---

## Timeline Estimada

```
Fase 0:  Fundação        ⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  ~2 dias
Fase 1:  Sidebar + Rotas ⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜⬜⬜  ~3 dias
Fase 2:  API Layer       ⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜⬜⬜  ~3 dias
Fase 3:  Dashboard       ⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜  ~3 dias
Fase 4:  Pedidos         ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜⬜⬜  ~2 dias
Fase 5:  Produtos        ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬜  ~3 dias
Fase 6:  Mensagens       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
Fase 7:  Minha Loja      ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
Fase 8:  Analytics       ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
Fase 9:  Avaliações      ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~1 dia
Fase 10: Configurações   ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~1 dia
Fase 11: Polimento UX    ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛  ~2 dias
                                  Total: ~26 dias
```
