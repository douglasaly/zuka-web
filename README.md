# Zuka Marketplace

Um marketplace moderno construído com **Next.js**, **tRPC**, **Drizzle ORM**, **PostgreSQL** e **Firebase**. Este repositório contém uma plataforma de comércio eletrônico com suporte a autenticação, controle de acesso por roles/permissions, gestão de produtos e lojas.

## 🚀 Visão Geral

O projeto já implementa a base de
- autenticação e autorização (Auth + RBAC)
- cadastro de usuários e perfis
- gestão de roles/permissões
- modelo de produtos, variantes, estoques e imagens
- estrutura de lojas, sellers e buyers
- conversas e participação em chats

Este `README` foi enriquecido para ser um documento adequado para um marketplace, com requisitos funcionais, não funcionais e regras de negócio detalhadas.

## 📌 O que este marketplace entrega

- Login, logout e recuperação de senha
- Controle de acesso por roles: `admin`, `seller`, `buyer`, `support`
- Cadastro e atualização de usuário
- Gestão de produtos com variantes e imagens
- Estoque e permissões de edição por seller
- Loja com perfil e seguidores
- Conversas e participantes de chat

## 🧩 Stack Tecnológica

- `next` — frontend e rotas API
- `@trpc/server` + `@trpc/client` — APIs tipadas end-to-end
- `drizzle-orm` — mapeamento objeto-relacional para PostgreSQL
- `pg` — driver PostgreSQL
- `firebase` / `firebase-admin` — autenticação e identidades
- `zod` — validação de esquema
- `tailwindcss`, `@base-ui/react`, `lucide-react` — UI e estilos

## ⚙️ Scripts úteis

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn format
yarn db:push
yarn db:generate
yarn db:migrate
yarn db:studio
```

## 📝 Requisitos Funcionais (RF)

### 1. Autenticação e conta

[ ] RF-001 — Cadastro de usuário com email e senha únicos

[ ] RF-002 — Login com email e senha e emissão de sessão/token

[ ] RF-003 — Logout e invalidação de sessão

[ ] RF-004 — Recuperação de senha via email

[ ] RF-005 — Rota `/auth/me` para obter usuário autenticado

[ ] RF-006 — Atualização de perfil e senha

### 2. Marketplace e produtos

[ ] RF-007 — Navegação de catálogo de produtos por categoria e loja

[ ] RF-008 — Visualização de produto com variantes, estoque e imagens

[ ] RF-009 — Seller pode criar, editar e excluir seus produtos

[ ] RF-010 — Seller pode gerenciar estoque e variantes

[ ] RF-011 — Produto deve conter preço, categoria e loja associada

[ ] RF-012 — Pesquisa e filtro por termo, categoria e loja

### 3. Lojas e vendedores

[ ] RF-013 — Perfil de loja com descrição, imagem e produtos

[ ] RF-014 — Sellers podem gerir apenas suas próprias lojas e produtos

[ ] RF-015 — Seguidores de loja e histórico de visitas

### 4. Compras e pedidos

[ ] RF-016 — Buyers podem adicionar produtos ao carrinho (se implementado)

[ ] RF-017 — Buyers podem criar pedidos e visualizar histórico de pedidos

[ ] RF-018 — O sistema deve validar estoque antes de confirmar pedido

[ ] RF-019 — Compras só podem ser feitas por usuários autenticados

### 5. Roles e permissões

[ ] RF-020 — Criação, edição e remoção de roles

[ ] RF-021 — Criação, edição e remoção de permissões

[ ] RF-022 — Associação de permissões a roles

[ ]RF-023 — Atribuição de roles a usuários

[ ] RF-024 — Validação de permissões antes de ações protegidas

[ ] RF-025 — Usuários sem permissão não conseguem acessar recursos restritos

### 6. Comunicação e suporte

[ ] RF-026 — Conversas entre participantes em threads ou chats

[ ] RF-027 — Controle de acesso à conversa apenas para participantes

[ ] RF-028 — Sistema de suporte/admin pode visualizar conversas relevantes

## ⚙️ Requisitos Não Funcionais (RNF)

[ ] RNF-001 — Senhas armazenadas com hash seguro (bcrypt / argon2)

[ ] RNF-002 — Todas as rotas protegidas validadas no backend

[ ] RNF-003 — Validação de autorização não deve depender do frontend

[ ] RNF-004 — Modularização por domínios: auth, users, products, stores, orders

[ ] RNF-005 — APIs rápidas com latência ideal abaixo de 300ms

[ ] RNF-006 — Consistência de sessão e cache de permissões

[ ] RNF-007 — Logs e rastreamento de erros para operações críticas

[ ] RNF-008 — Resiliência de DB para transações de estoque/pedidos

## 📜 Regras de Negócio (RN)

[ ] RN-001 — Email deve ser único na base de usuários

[ ] RN-002 — Senha deve ter no mínimo 8 caracteres

[ ] RN-003 — Apenas usuários autenticados podem acessar rotas privadas

[ ] RN-004 — `admin` é superusuário e tem acesso total

[ ] RN-005 — Usuário pode ter múltiplas roles simultaneamente

[ ] RN-006 — Permissões são atribuídas via roles, não diretamente a usuários

[ ] RN-007 — Sellers só gerenciam seus próprios produtos e lojas

[ ] RN-008 — Buyers não podem criar ou editar produtos

[ ] RN-009 — O estoque não pode ficar negativo

[ ] RN-010 — Produtos só são publicados se tiverem preço e categoria válidos

[ ] RN-011 — Alterações em roles/permissões entram em efeito imediato

[ ] RN-012 — Logout deve invalidar sessão e tokens ativos

## 📂 Estrutura do projeto

- `src/app/` — páginas e layout do Next.js
- `src/db/` — definitions de schema, migrações e seeds
- `src/lib/` — utilitários e inicialização de Firebase / query client
- `src/trpc/` — configuração de tRPC e routers
- `src/components/` — componentes reutilizáveis
- `functions/` — possíveis funções serverless ou scripts auxiliares

## ✅ Melhoria aplicada

Este README agora é apropriado para um marketplace porque entrega:
- visão clara do produto e da arquitetura
- instruções de instalação e execução
- requisitos funcionais e não funcionais estendidos
- regras de negócio alinhadas à plataforma

> Se quiser, posso também gerar um `README` em inglês ou adicionar um roadmap de funcionalidades futuras para o marketplace.
