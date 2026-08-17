# Zuka API — Plano de Profissionalização

> Auditoria completa de 42 rotas API, 43 hooks React Query, 25 tabelas Supabase.
> Criado: 2026-07-10

---

## Índice

1. [Resumo Executivo](#1-resumo-executivo)
2. [Fase 1 — Índices Críticos (DB)](#2-fase-1--índices-críticos-db)
3. [Fase 2 — Corrigir N+1 Queries](#3-fase-2--corrigir-n1-queries)
4. [Fase 3 — Padronização da API](#4-fase-3--padronização-da-api)
5. [Fase 4 — Paginação & useInfiniteQuery](#5-fase-4--paginação--useinfinitequery)
6. [Fase 5 — Segurança & Validação](#6-fase-5--segurança--validação)
7. [Fase 6 — Cache & Performance](#7-fase-6--cache--performance)
8. [Fase 7 — Full-Text Search](#8-fase-7--full-text-search)
9. [Matriz de Prioridades](#9-matrizes-de-prioridades)

---

## 1. Resumo Executivo

### Problemas encontrados

| Categoria | Encontrados | Severidade |
|-----------|------------|------------|
| N+1 queries (100+ queries por request) | 6 rotas | 🔴 Crítico |
| Índices DB ausentes em tabelas de alto volume | 8+ tabelas | 🔴 Crítico |
| Sem paginação (resultsets ilimitados) | 8 rotas | 🟠 Alto |
| useInfiniteQuery não utilizado | 0 de 43 hooks | 🟠 Alto |
| Respostas com formatos inconsistentes | 9 formatos diferentes | 🟡 Médio |
| Mass-assignment (PATCH sem validação) | 1 rota admin | 🔴 Crítico |
| Search com ILIKE (full table scan) | 1 rota | 🟠 Alto |
| Queries sequenciais paralelizáveis | 8+ rotas | 🟡 Médio |
| Soft-delete sem indexação parcial | 15 tabelas | 🟠 Alto |
| Triggers `updated_at` ausentes | 7 tabelas | 🟡 Baixo |

### Impacto estimado

- **Fase 1+2**: Redução de ~90% no tempo de resposta das rotas com N+1
- **Fase 4**: Eliminação de carregamentos lentos em mensagens, produtos e conversas
- **Fase 7**: Search 10-50x mais rápido com GIN + tsvector vs ILIKE

---

## 2. Fase 1 — Índices Críticos (DB)

**Prioridade**: 🔴 IMEDIATA
**Ficheiro**: Criar migration `supabase/migrations/YYYYMMDD_critical_indexes.sql`

- [x] **2.1** Tabela `messages` — idx_messages_conversation_created, idx_messages_sender
- [x] **2.2** Tabela `products` — idx_products_store_status, idx_products_category_status, idx_products_visible_created, idx_products_store_visible
- [x] **2.3** Tabela `product_images` — idx_product_images_product
- [x] **2.4** ~~Tabela `product_variants`~~ — removida (sem modelo de inventário)
- [x] **2.5** Tabela `orders` — idx_orders_buyer_created, idx_orders_store_status
- [x] **2.6** Tabela `stores` — idx_stores_status_created, idx_stores_province
- [x] **2.7** Soft-Delete indexes — users, categories, conversations, verification_documents
- [ ] **2.8** Triggers `updated_at` ausentes — seller_profiles, seller_onboarding, product_images, store_members

---

## 3. Fase 2 — Corrigir N+1 Queries

**Prioridade**: 🔴 IMEDIATA

### 3.1 🔴 `GET /api/stores` — 100+ queries

**Problema**: Para cada loja, faz 2 queries separadas (product count + follower count).

- [x] Fix N+1 com subqueries inline (`product_count:products(count)`, `follower_count:store_followers(count)`)
- [x] Adicionado `verified_at` ao select
- [x] Usando `mapStoreRow` para retornar `StoreProfile` correto com `location`, `neighborhood`, etc.

### 3.2 🔴 `GET /api/admin/stores` — mesmo problema

- [x] Refatorar — reutilizar padrão de subqueries (`product_count:products(count)`, `follower_count:store_followers(count)`)
- [x] Swagger `GET /api/admin/stores` actualizado

### 3.3 🔴 `GET /api/admin/users` — 100+ queries

- [x] Refatorar com 3 queries em lote: users + `user_roles` + `stores` via `.in('user_id' / 'owner_id')`
- [x] Swagger `GET /api/admin/users` actualizado

### 3.4 🟠 `GET /api/admin/analytics` — 23 queries

- [x] 4 queries em paralelo (`Promise.all`) + nested counts nas top stores
- [x] Swagger `GET /api/admin/analytics` actualizado

### 3.5 🟠 `GET /api/me/profile` — 4+ queries sequenciais + N+1 stores

- [x] Paralelizar com `Promise.all` e nested `product_count:products(count)`
- [x] PATCH com `UpdateProfileSchema` (allowlist)
- [x] Swagger `GET|PATCH /api/me/profile` actualizado

### 3.6 🟠 `GET /api/seller/unread-counts` — Carrega todas as messages na memória

- [x] Substituir por RPC `count_store_unread_conversations` (SQL `COUNT` + `EXISTS`)
- [x] Fallback: 3 queries com `last_message_id` se a função ainda não estiver aplicada
- [x] Swagger `GET /api/seller/unread-counts` actualizado
- [ ] Aplicar migration `supabase/migrations/20260817144125_count_store_unread_conversations.sql` no Supabase (SQL editor ou `supabase db query --linked -f ...`)

### 3.7 🟡 `GET /api/stores/conversations` — Fetch de todas as buyer messages

- [x] Unread via última mensagem (`store_id` + `created_at` vs `last_read_at`) — sem scan de todas as mensagens da página
- [x] Swagger `GET /api/stores/conversations` actualizado

### 3.8 🟡 `GET /api/admin/notifications` — Fetch 1000 rows → group in JS

- [ ] Usar `GROUP BY batch_id` no SQL

---

## 4. Fase 3 — Padronização da API

**Prioridade**: 🟡 MÉDIA

### 4.1 Formato de resposta padrão

- [x] Criado `src/lib/api-response.ts` com `apiSuccess`, `apiList`, `apiCursorList`, `apiError`, `ErrorCode`
- [x] Formato `{ success, data }` / `{ success, data, pagination }` / `{ success: false, error: { code, message } }`

### 4.2 Centralizar helper de resposta

- [x] Criado `src/lib/api-response.ts` (106 linhas)
- [x] Re-exporta `withErrorHandling` de `api-handler.ts`

### 4.3 Centralizar handler de erros

- [x] Criado `src/lib/api-handler.ts` com `withErrorHandling(handler)`
- [x] Captura erros e retorna `apiError('INTERNAL_ERROR', ...)`

### 4.4 Migração das rotas (ordem)

| Grupo | Rotas | Estado |
|-------|-------|--------|
| **Alta** | `GET /api/categories` | ✅ Convertido |
| **Alta** | `GET /api/products` | ✅ Convertido — cursor-based |
| **Alta** | `POST /api/products` | ✅ Convertido — validação zod |
| **Alta** | `GET /api/stores` | ✅ Convertido — N+1 fix + mapStoreRow |
| **Alta** | `POST /api/stores` | ✅ Convertido — validação zod |
| **Alta** | `GET /api/conversations` | ✅ Convertido — cursor-based |
| **Alta** | `POST /api/conversations` | ✅ Convertido — validação zod |
| **Alta** | `GET /api/conversations/[id]/messages` | ✅ Convertido — cursor-based |
| **Alta** | `POST /api/conversations/[id]/messages` | ✅ Convertido — validação zod |
| **Média** | `GET /api/notifications` | ❌ Pendente |
| **Média** | `GET /api/orders` | ✅ Convertido — cursor-based |
| **Média** | `GET /api/seller/*` | 🟡 Parcial — `GET /api/seller/unread-counts` (RPC COUNT) |
| **Baixa** | `GET /api/admin/*` | 🟡 Parcial — `GET /api/admin/stores`, `GET /api/admin/users`, `PATCH|DELETE /api/admin/products/[id]` |
| **Baixa** | `GET /api/auth/*` | ❌ Pendente |
| **Baixa** | `POST /api/uploads/*` | ❌ Pendente |

### 4.5 Validção com zod schemas

- [x] Criado `src/lib/validations.ts` com: `OffsetPaginationSchema`, `CursorPaginationSchema`, `ProductFiltersSchema`, `CreateProductSchema`, `AdminUpdateProductSchema`, `AdminListQuerySchema`, `StoreFiltersSchema`, `CreateStoreSchema`, `CreateConversationSchema`, `SendMessageSchema`, `MarkNotificationsReadSchema`, `UpdateProfileSchema`
- [x] Helpers `parseQueryParams`, `parseBody` e `sanitizeIlikeTerm`

### 4.6 Auth unificada

- [x] Criado `src/lib/auth/index.ts` com hierarquia: `getAuth()` → `requireAuth()` → `requireSeller()` → `requireAdmin()` → `requireConversationParticipant()`
- [x] Tipos: `Auth`, `AuthenticatedAuth`, `SellerAuth`, `AdminAuth`
- [x] Arquivos antigos (`session.ts`, `roles.ts`, `admin.ts`, `seller.ts`) mantidos para backward compat

---

## 5. Fase 4 — Paginação & useInfiniteQuery

**Prioridade**: 🟠 ALTA

### 5.1 Estratégia: Cursor-based para listas infinitas

- [x] Padrão documentado: `cursor` param, `limit+1` para detectar `hasMore`
- [x] Resposta: `{ success, data, pagination: { hasMore, nextCursor, limit } }`

### 5.2 Rotas a converter para cursor-based

| Rota | Critério de Cursor | Estado |
|------|-------------------|--------|
| `GET /api/products` | `created_at` | ✅ Convertido |
| `GET /api/conversations` | `last_message_at` | ✅ Convertido |
| `GET /api/conversations/[id]/messages` | `created_at` | ✅ Convertido |
| `GET /api/stores` | offset-based | ✅ Convertido (offset com `hasMore`) |
| `GET /api/stores/[slug]/products` | Já usa cursor | ✅ |
| `GET /api/notifications` | `created_at` | ❌ Pendente |
| `GET /api/orders` | `created_at` | ✅ Convertido |
| `GET /api/seller/products` | `created_at` | ❌ Pendente |
| `GET /api/seller/orders` | `created_at` | ❌ Pendente |
| `GET /api/saved-items` | `created_at` | ❌ Pendente |

### 5.3 Frontend: Criar hooks `useInfiniteQuery`

- [x] Criado `src/hooks/use-infinite-list.ts` — hook genérico `useInfiniteList<T>()`
- [x] Suporta `endpoint`, `limit`, `extraParams`, `select`, `enabled`, `refetchInterval`
- [x] Helper `flattenPages()` para extrair items de todas as páginas

### 5.4 Hooks específicos a criar

| Hook | Endpoint | Estado |
|------|----------|--------|
| `useInfiniteProducts` (explore) | `GET /api/products` | ✅ via `fetchProductsInfinite` no explore-view |
| `useInfiniteStores` (explore) | `GET /api/stores` | ✅ via `fetchStoresInfinite` no explore-view |
| `useInfiniteConversations` | `GET /api/conversations` | ❌ Pendente |
| `useInfiniteMessages` | `GET /api/conversations/[id]/messages` | ❌ Pendente |
| `useInfiniteNotifications` | `GET /api/notifications` | ❌ Pendente |
| `useInfiniteOrders` | `GET /api/orders` | ❌ Pendente |
| `useInfiniteSellerProducts` | `GET /api/seller/products` | ❌ Pendente |
| `useInfiniteSellerOrders` | `GET /api/seller/orders` | ❌ Pendente |
| `useInfiniteSavedItems` | `GET /api/saved-items` | ❌ Pendente |

### 5.5 Adicionar `IntersectionObserver` para scroll infinito

- [x] Criado `src/components/infinite-scroll-trigger.tsx`
- [x] Props: `hasMore`, `isLoading`, `onLoadMore`, `margin`, `className`
- [x] Usado em `ExploreProductsGrid` e `ExploreStoresGrid`

### 5.6 Fetchers para infinite scroll

- [x] Criado `fetchProductsInfinite()` em `src/lib/api/marketplace.ts`
- [x] Criado `fetchStoresInfinite()` em `src/lib/api/marketplace.ts`

### 5.7 Fix de fetchers existentes

- [x] `fetchProducts` — suporta `{ success, data }` e formato antigo
- [x] `fetchStores` — suporta `{ success, data: { stores } }` e formato antigo
- [x] `fetchStoreBySlug` — suporta `{ success, data: { store } }` e formato antigo
- [x] `createProduct` — suporta `{ success, data: { product } }` e formato antigo
- [x] `createStore` — suporta `{ success, data: { store } }` e formato antigo
- [x] `startConversation` — suporta `{ success, data: { conversationId } }` e formato antigo

### 5.8 Fix de hooks/consumers existentes

- [x] `useInbox` — `hasMore` movido para `json.pagination?.hasMore`
- [x] `useConversation.fetchMessages` — select fields adicionados (`status`, `updated_at`, `deleted_at`)
- [x] `categories-section.tsx` — `json.data ?? json`
- [x] `seller-onboarding-view.tsx` — `json.data ?? json`
- [x] `seller-products-view.tsx` — `json.data ?? json`
- [x] `seller-categories-view.tsx` — `json.data ?? json`
- [x] `product-form.tsx` — `json.data ?? json` no `useCategories()`
- [x] `signup-view.tsx` — `Array.isArray(d?.data) ? d.data : ...`

---

## 6. Fase 5 — Segurança & Validação

**Prioridade**: 🔴 ALTA (mass-assignment)

### 6.1 🔴 `PATCH /api/admin/products/[id]` — Mass-Assignment

- [x] Allowlist explícita via `AdminUpdateProductSchema` (ignora `id`, `store_id`, `deleted_at`, etc.)
- [x] `PATCH`/`DELETE` com `requireAdmin` + `withErrorHandling`
- [x] Swagger `PATCH|DELETE /api/admin/products/{id}` actualizado (`AdminUpdateProductInput`, `{ success, data: { ok } }`)

### 6.2 Validação de inputs com zod

- [x] Criado `src/lib/validations.ts` com schemas para products, stores, conversations, messages
- [x] Rotas convertidas usam `safeParse` + `apiError(ErrorCode.VALIDATION_ERROR, ...)`
- [x] Admin products PATCH e `PATCH /api/me/profile` validados; falta notifications, resto do admin

### 6.3 Validação de query params

- [x] `OffsetPaginationSchema` e `CursorPaginationSchema` com `z.coerce`
- [x] `ProductFiltersSchema`, `StoreFiltersSchema` e `AdminListQuerySchema`
- [ ] Falta schemas para orders, notifications, resto do admin

### 6.4 Autenticação: Padronizar helpers

- [x] Hierarquia unificada: `getAuth` → `requireAuth` → `requireSeller` → `requireAdmin`
- [x] `requireConversationParticipant` para acesso a conversas
- [x] Arquivos antigos mantidos para backward compat

---

## 7. Fase 6 — Cache & Performance

**Prioridade**: 🟡 MÉDIA

### 7.1 Cache de dados estáticos (server-side)

- [ ] Implementar `unstable_cache` para categorias e províncias

### 7.2 Cache de stats dashboard

- [ ] Adicionar `staleTime: 60_000` nos queries de stats

### 7.3 Paralelizar queries sequenciais

- [x] `GET /api/conversations/[id]/messages` — usa `Promise.all` para batch unread counts
- [x] `GET /api/me/profile` — `Promise.all` (roles + seller, depois onboarding + stores)

### 7.4 Select específicos (não usar `*`)

- [x] `GET /api/stores` — select explícito com campos + subqueries
- [x] `GET /api/products` — select com joins explícitos
- [x] `GET /api/conversations` — select explícito com joins
- [x] `GET /api/conversations/[id]/messages` — select explícito
- [x] `GET /api/categories` — select explícito
- [x] `GET /api/admin/stores` — select explícito + nested counts
- [x] `GET /api/admin/users` — select explícito (users + batch roles/stores)

### 7.5 Pagination com `count: 'exact'`

- [x] `GET /api/stores` — usa `count: 'exact'` no query

---

## 8. Fase 7 — Full-Text Search

**Prioridade**: 🟠 ALTA

### 8.1 Problema atual

- [x] `GET /api/search` combina ILIKE no `name` (substring) com FTS prefixado no `search_vector`; fallback ILIKE se o filtro FTS falhar

### 8.2 Solução: PostgreSQL Full-Text Search com tsvector

- [x] Criar coluna `search_vector` em products, stores, categories — migration `20260817150223_marketplace_search_vector.sql`
- [x] Criar índices GIN (parciais, `WHERE deleted_at IS NULL`)
- [ ] Criar função RPC `search_marketplace`
- [x] Route handler usa `textSearch` (config `portuguese`) com fallback ILIKE
- [ ] Aplicar a migration no Supabase

---

## 9. Matriz de Prioridades

### Sprint 1 (Imediato — 1-2 dias)

| # | Tarefa | Tipo | Estado |
|---|--------|------|--------|
| 1 | Criar migration de índices (Fase 2.1–2.7) | DB | ✅ Feito (aplicado direto no Supabase) |
| 2 | Fix mass-assignment em `admin/products/[id]` | Security | ✅ Feito (`AdminUpdateProductSchema`) |
| 3 | Adicionar paginação a `conversations/[id]/messages` | API | ✅ Feito (cursor-based) |
| 4 | Adicionar paginação a `orders` (buyer) | API | ✅ Feito (cursor-based) |

### Sprint 2 (Curto prazo — 3-5 dias)

| # | Tarefa | Tipo | Estado |
|---|--------|------|--------|
| 5 | Refatorar `GET /api/stores` N+1 | API + DB | ✅ Feito (subqueries inline) |
| 6 | Refatorar `GET /api/admin/stores` N+1 | API + DB | ✅ Feito (subqueries inline) |
| 7 | Refatorar `GET /api/admin/users` N+1 | API + DB | ✅ Feito (batch `.in()`) |
| 8 | Refatorar `GET /api/seller/unread-counts` → SQL COUNT | API | ✅ Feito (RPC + fallback) |
| 9 | Padronizar formato de resposta + criar helpers | API | ✅ Feito (api-response.ts, api-handler.ts) |
| 10 | Centralizar error handling | API | ✅ Feito (withErrorHandling) |

### Sprint 3 (Médio prazo — 1-2 semanas)

| # | Tarefa | Tipo | Estado |
|---|--------|------|--------|
| 11 | Implementar cursor-based pagination em rotas principais | API | ✅ Feito (products, conversations, messages, orders) |
| 12 | Criar `useInfiniteList` hook genérico | Frontend | ✅ Feito |
| 13 | Criar hooks `useInfinite*` específicos | Frontend | ✅ 2/8 feitos (products, stores no explore) |
| 14 | Adicionar `InfiniteScrollTrigger` component | Frontend | ✅ Feito |
| 15 | Refatorar `admin/analytics` → RPC | API + DB | ✅ Feito (4 queries + nested counts) |
| 16 | Refatorar `me/profile` → Promise.all + RPC | API | ✅ Feito (Promise.all + nested counts) |
| 17 | Full-text search com tsvector + GIN | DB + API | 🟡 Parcial — migration + textSearch; falta aplicar e RPC |
| 18 | Validar todos os inputs com zod schemas | API | ✅ Feito (rotas principais) |
| 19 | Cache de categorias/províncias | API | ❌ Pendente |

### Sprint 4 (Longo prazo — 2-4 semanas)

| # | Tarefa | Tipo | Estado |
|---|--------|------|--------|
| 20 | Autenticação unificada (4 helpers → hierarquia) | API | ✅ Feito |
| 21 | Converter offset → cursor em admin routes | API | ❌ Pendente |
| 22 | Select específicos em todos os queries | API | ✅ Feito (rotas convertidas) |
| 23 | Triggers `updated_at` nas 7 tabelas | DB | ❌ Pendente |
| 24 | Refatorar `admin/notifications` → SQL GROUP BY | API | ❌ Pendente |
| 25 | Refatorar `stores/conversations` unread → COUNT | API | ✅ Feito (last_message store_id vs last_read_at) |

---

## Checklist de Padrão para Novas Rotas

Toda nova rota DEVE seguir:

- [x] Input validado com `zod`
- [x] Auth via helper unificado (`requireAuth`, `requireSeller`, `requireAdmin`)
- [x] Formato de resposta padrão (`apiSuccess`, `apiList`, `apiError`)
- [x] Cursor-based pagination para listas
- [x] Select explícito (nunca `*`)
- [x] Soft-delete filter (`WHERE deleted_at IS NULL`)
- [x] `Promise.all` para queries independentes
- [x] Tratamento de erros com `withErrorHandling`
- [ ] Rate limiting básico (middleware)
- [ ] Logging estruturado

---

## Rotas com Estado Atual vs Ideal

| Rota | Estado Atual | Fase | Estado |
|------|-------------|------|--------|
| `GET /api/stores` | N+1 → subqueries inline | Fase 2 | ✅ Feito |
| `GET /api/admin/stores` | N+1 → subqueries inline | Fase 2 | ✅ Feito |
| `GET /api/admin/users` | N+1 → 3 queries em lote | Fase 2 | ✅ Feito |
| `GET /api/admin/analytics` | 4 queries + nested counts | Fase 2 | ✅ Feito |
| `GET /api/me/profile` | Promise.all + nested counts | Fase 2 | ✅ Feito |
| `GET /api/seller/unread-counts` | RPC COUNT + EXISTS | Fase 2 | ✅ Feito |
| `GET /api/stores/conversations` | Unread via last_message | Fase 2 | ✅ Feito |
| `GET /api/conversations` | Cursor-based + useInfiniteQuery | Fase 4 | ✅ Feito |
| `GET /api/conversations/[id]/messages` | Cursor-based | Fase 4 | ✅ Feito |
| `GET /api/notifications` | 🟡 Offset-based | Fase 4 | ❌ Pendente |
| `GET /api/products` | Cursor-based + useInfiniteQuery | Fase 4 | ✅ Feito |
| `GET /api/orders` | Cursor-based | Fase 4 | ✅ Feito |
| `GET /api/seller/products` | 🟡 Category filter in JS | Fase 2 | ❌ Pendente |
| `GET /api/search` | FTS + GIN (fallback ILIKE) | Fase 7 | 🟡 Parcial (aplicar migration) |
| `PATCH /api/admin/products/[id]` | Allowlist zod | Fase 5 | ✅ Feito |
| `GET /api/stores/[slug]/products` | ✅ Cursor-based | — | ✅ |
| `GET /api/categories` | ✅ Lookup table + apiSuccess | — | ✅ |
| `GET /api/provinces` | ✅ Lookup table | — | ✅ |
