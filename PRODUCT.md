# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- inferred: user rejected the first draft without corrections; derived from repo (AGENTS.md, routes, copy). -->
Primary: compradores em Moçambique a descobrir produtos e lojas locais, muitas vezes no telemóvel, a decidir se contactam o vendedor.
Secondary: vendedores a gerir loja, produtos, pedidos, mensagens e reputação no dashboard.

## Product Purpose

<!-- inferred from AGENTS.md + marketplace UI -->
Zuka é um marketplace que liga compradores a lojas/vendedores locais (contacto directo: WhatsApp, telefone, chat). Sucesso do comprador: encontrar um produto fiável e contactar a loja. Sucesso do vendedor: receber pedidos e manter reputação.

## Positioning

Marketplace local com contacto humano (não checkout fechado como único caminho). Avaliações pós-entrega sustentam confiança entre desconhecidos.

## Operating Context

Browse feed/explorar → PDP → loja → mensagens/contacto. Após pedido COMPLETED, comprador pode avaliar (API buyer ainda por construir). Seller responde no dashboard.

## Capabilities and Constraints

- Auth: Firebase; dados: Supabase Postgres; storage: R2.
- UI em português (Moçambique). Soft delete; UUID v7.
- Não regenerar/editar `src/lib/supabase/types.ts` sem pedido explícito; migrations aplicadas manualmente.
- Avaliações v1 públicas: só leitura; teaser na PDP + página dedicada; paginação numérica.
- Open: envio de avaliação pelo comprador; mídia; votos “útil”; tags/sentimento.

## Brand Commitments

Nome: Zuka. Tom: directo, informal “tu” em toasts. Selo de loja existente: “Verificada” (não inventar “Mais vendido” / “Escolha da loja” sem dados).

## Evidence on Hand

- Schema/migration: `supabase/migrations/20260731075057_reviews_and_store_ratings.sql`
- Seller avaliações: `/dashboard/seller/avaliacoes`
- Seed: `yarn db:seed:reviews`
- Store tab Avaliações ainda agregada/stub; ratings no mapper podem estar hardcoded

## Product Principles

1. Não fabricar provas (selos, %, mídia) sem dados reais.
2. Confiança do comprador antes do contacto com a loja.
3. Um termo = um significado (Avaliações, Nota do produto, Nota da loja, Compra confirmada, Resposta da loja).
4. Mobile-first na leitura de avaliações.
5. Extender o sistema visual existente, não redesenhar o marketplace.

## Accessibility & Inclusion

Contraste legível em estrelas e texto; alvos de toque ≥44px nos controlos de filtro/paginação; nomes acessíveis em controlos só-ícone.
