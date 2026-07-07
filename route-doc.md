# Zuka API — Documentação para integração mobile

<!-- 
  Este ficheiro é a fonte única de verdade para a API do Zuka.
  Qualquer alteração nas rotas deve ser reflectida aqui.
-->

**Base URL:** `https://zuka.co.mz/api`

**Formato:** JSON (`Content-Type: application/json`)

**Autenticação:** As rotas usam um cookie de sessão httpOnly (criado via Firebase Auth).  
Para mobile, o fluxo é:
1. Login com Firebase Auth (SDK mobile) → obtém `idToken`
2. `POST /api/auth/register` com o `idToken` → sincroniza user no Supabase
3. `POST /api/auth/session` com o `idToken` → recebe o cookie (definir `credentials: 'include'`)
4. Incluir sempre `"credentials": "include"` em todos os `fetch()` subsequentes

---

## Índice

- [Auth](#1-auth)
- [Perfil](#2-perfil)
- [Produtos](#3-produtos)
- [Categorias](#4-categorias)
- [Lojas](#5-lojas)
- [Conversas / Mensagens](#6-conversas--mensagens)
- [Notificações](#7-notificações)
- [Pedidos](#8-pedidos)
- [Itens Salvos](#9-itens-slavos)
- [Uploads](#10-uploads)
- [Onboarding](#11-onboarding)
- [Seller](#12-seller)
- [Admin — Categorias](#13-admin--categorias)
- [Admin — Produtos](#14-admin--produtos)
- [Admin — Lojas](#15-admin--lojas)
- [Admin — Utilizadores](#16-admin--utilizadores)
- [Admin — Estatísticas](#17-admin--estatísticas)
- [Admin — Notificações](#18-admin--notificações)

---

## 1. Auth

### `POST /api/auth/register`

Valida o token Firebase e cria/sincroniza o user no Supabase.

```
POST /api/auth/register
Content-Type: application/json

{
  "token": "string (Firebase idToken)"
}
```

**Success 200:**
```json
{
  "success": true,
  "user": {
    "id": "0193f7c0-... (uuid)",
    "firebaseUid": "abc123... (Firebase UID)",
    "email": "user@example.com",
    "firstName": "João",
    "lastName": "Silva"
  }
}
```

**Error 401:**
```json
{
  "error": "Validation failed"
}
```

---

### `POST /api/auth/session`

Cria o cookie de sessão a partir do token Firebase.

```
POST /api/auth/session
Content-Type: application/json

{
  "token": "string (Firebase idToken)"
}
```

**Success 200:**
```json
{
  "status": "login success."
}
```

**Error 401:**
```json
{
  "error": "UNAUTHORIZED"
}
```

---

### `GET /api/auth/me`

Retorna o user autenticado (lê cookie de sessão).

```
GET /api/auth/me
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "user": {
    "id": "0193f7c0-...",
    "firebase_uid": "abc123...",
    "email": "user@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "avatar_url": null,
    "phone_number": "+258840000000",
    "email_verified": false,
    "phone_verified": false,
    "status": "ACTIVE",
    "created_at": "2026-06-01T10:00:00.000Z",
    "updated_at": "2026-06-15T14:30:00.000Z"
  }
}
```

**Error 401:** `Unauthorized` (texto plano)

---

### `POST /api/auth/logout`

Remove o cookie de sessão.

```
POST /api/auth/logout
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true
}
```

---

## 2. Perfil

### `GET /api/me/profile`

Perfil completo do user autenticado: dados pessoais, roles, seller profile, lojas, onboarding.

```
GET /api/me/profile
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "profile": {
    "id": "0193f7c0-...",
    "email": "user@example.com",
    "firstName": "João",
    "lastName": "Silva",
    "avatarUrl": "https://...",
    "phoneNumber": "+258840000000",
    "emailVerified": false,
    "phoneVerified": false,
    "roles": ["buyer"],
    "sellerProfile": {
      "id": "0193f7c1-...",
      "status": "PENDING"
    },
    "stores": [
      {
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "slug": "loja-do-joao",
        "status": "ACTIVE",
        "productCount": 12
      }
    ],
    "onboarding": {
      "status": "COMPLETED",
      "currentStep": null
    }
  }
}
```

**Error 401:**
```json
{
  "error": "Unauthorized"
}
```

**Error 500:**
```json
{
  "error": "Failed to load profile"
}
```

---

## 3. Produtos

### `GET /api/products`

Lista produtos públicos visíveis, com paginação e filtros.

```
GET /api/products?category=<slug>&search=<term>&limit=<number>&page=<number>
```

| Query param | Tipo | Descrição |
|---|---|---|
| `category` | string | Slug da categoria para filtrar |
| `search` | string | Pesquisa por nome do produto |
| `limit` | number | Limite de resultados (default 20) |
| `page` | number | Número da página (default 1) |

**Success 200:**
```json
{
  "success": true,
  "products": [
    {
      "product": {
        "id": "0193f7c3-...",
        "store_id": "0193f7c2-...",
        "category_id": "0193f7c4-...",
        "name": "Tênis Nike Air Max",
        "slug": "tenis-nike-air-max",
        "is_visible": true,
        "description": "Tênis original Nike...",
        "status": "ACTIVE",
        "price": 7500,
        "discount_price": 6500,
        "currency": "MZN",
        "created_at": "2026-06-10T08:00:00.000Z",
        "updated_at": "2026-06-12T10:00:00.000Z",
        "deleted_at": null
      },
      "store": {
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "slug": "loja-do-joao",
        "logo_url": "https://..."
      },
      "category": {
        "id": "0193f7c4-...",
        "name": "Calçado",
        "slug": "calcado"
      },
      "images": [
        {
          "id": "0193f7c5-...",
          "product_id": "0193f7c3-...",
          "url": "https://...",
          "is_primary": true,
          "alt_text": null
        }
      ]
    }
  ],
  "metadata": {
    "page": 1,
    "totalCount": 45,
    "limit": 20
  }
}
```

**Error 500:**
```json
{
  "error": "...",
  "success": false,
  "message": "Erro ao buscar produtos"
}
```

---

### `POST /api/products`

Cria um novo produto (apenas seller com loja).

```
POST /api/products
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "name": "Tênis Nike Air Max",
  "description": "Tênis original Nike...",
  "categoryId": "0193f7c4-...",
  "price": 7500,
  "discountPrice": 6500,
  "quantity": 10,
  "imageUrl": "https://... (URL do upload presignado)"
}
```

**Success 200:**
```json
{
  "success": true,
  "product": {
    "id": "0193f7c3-...",
    "store_id": "0193f7c2-...",
    "category_id": "0193f7c4-...",
    "name": "Tênis Nike Air Max",
    "slug": "tenis-nike-air-max",
    "price": 7500,
    "status": "ACTIVE",
    "created_at": "2026-06-10T08:00:00.000Z"
  }
}
```

**Error 400:**
```json
{
  "error": "Nome, categoria e preço são obrigatórios"
}
```

---

### `GET /api/products/[id]`

Detalhes completos de um produto.

```
GET /api/products/0193f7c3-...
```

**Success 200:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "0193f7c3-...",
      "store_id": "0193f7c2-...",
      "category_id": "0193f7c4-...",
      "name": "Tênis Nike Air Max",
      "slug": "tenis-nike-air-max",
      "description": "Tênis original Nike...",
      "price": 7500,
      "discount_price": 6500,
      "currency": "MZN",
      "status": "ACTIVE",
      "is_visible": true,
      "negotiable": true,
      "has_delivery": false,
      "store_name": "Loja do João",
      "store_slug": "loja-do-joao",
      "store_avatar": "https://...",
      "store_phone": "+258840000000",
      "store_whatsapp": "+258840000000",
      "store_location": "Maputo • Sommerchild",
      "store_verified": true,
      "store_rating": 4.5
    },
    "store": {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "logo_url": "https://...",
      "slug": "loja-do-joao"
    },
    "category": {
      "id": "0193f7c4-...",
      "name": "Calçado",
      "slug": "calcado"
    },
    "images": [
      "https://..."
    ]
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Produto não encontrado"
}
```

---

## 4. Categorias

### `GET /api/categories`

Lista todas as categorias (pública).

```
GET /api/categories
```

**Success 200:**
```json
[
  {
    "id": "0193f7c4-...",
    "parentId": null,
    "name": "Calçado",
    "slug": "calcado",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  },
  {
    "id": "0193f7c6-...",
    "parentId": "0193f7c4-...",
    "name": "Tênis",
    "slug": "tenis",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": null,
    "deletedAt": null
  }
]
```

**Error 500:**
```json
{
  "error": "...",
  "success": false,
  "message": "Erro ao buscar categorias"
}
```

---

## 5. Lojas

### `GET /api/stores`

Lista lojas públicas.

```
GET /api/stores?search=<term>
```

**Success 200:**
```json
{
  "success": true,
  "stores": [
    {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "slug": "loja-do-joao",
      "location": "Maputo • Sommerchild",
      "neighborhood": "Sommerchild",
      "verified": true,
      "rating": 4.5,
      "reviewCount": 23,
      "followers": 150,
      "productCount": 12,
      "bannerUrl": "https://...",
      "logoUrl": "https://...",
      "whatsapp": "+258840000000",
      "phone": "+258840000000",
      "about": "Loja de calçado desportivo...",
      "email": "loja@example.com",
      "status": "ACTIVE"
    }
  ]
}
```

**Error 500:**
```json
{
  "error": "Failed to load stores"
}
```

---

### `POST /api/stores`

Cria uma nova loja (apenas seller).

```
POST /api/stores
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "name": "Loja do João",
  "description": "Loja de calçado...",
  "provinceId": "0193f7c7-...",
  "categoryId": "0193f7c4-...",
  "neighborhood": "Sommerchild",
  "email": "loja@example.com",
  "phone": "+258840000000",
  "whatsapp": "+258840000000"
}
```

**Success 200:**
```json
{
  "success": true,
  "store": {
    "id": "0193f7c2-...",
    "name": "Loja do João",
    "slug": "loja-do-joao",
    "state": "Maputo",
    "created_at": "2026-06-10T08:00:00.000Z"
  }
}
```

---

### `GET /api/stores/[slug]`

Detalhes de uma loja + produtos paginados.

```
GET /api/stores/loja-do-joao?page=1&limit=10
```

**Success 200:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "slug": "loja-do-joao",
      "description": "Loja de calçado...",
      "logo_url": "https://...",
      "banner_url": "https://...",
      "phone": "+258840000000",
      "whatsapp": "+258840000000",
      "email": "loja@example.com",
      "state": "Maputo",
      "neighborhood": "Sommerchild",
      "verified_at": "2026-05-01T00:00:00.000Z",
      "status": "ACTIVE",
      "product_count": 12,
      "follower_count": 150
    },
    "products": [
      {
        "product": {
          "id": "0193f7c3-...",
          "name": "Tênis Nike Air Max",
          "price": 7500,
          "currency": "MZN",
          "slug": "tenis-nike-air-max"
        },
        "category": {
          "id": "0193f7c4-...",
          "name": "Tênis",
          "slug": "tenis"
        },
        "images": [
          {
            "url": "https://...",
            "is_primary": true
          }
        ]
      }
    ],
    "page": 1,
    "limit": 10
  }
}
```

**Error 404:**
```json
{
  "success": false,
  "message": "Store não encontrada"
}
```

---

### `GET /api/stores/[slug]/products`

Produtos paginados de uma loja (formato cursor).

```
GET /api/stores/loja-do-joao/products?cursor=<id>&limit=10
```

**Success 200:**
```json
{
  "success": true,
  "data": {
    "store": {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "slug": "loja-do-joao"
    },
    "products": [
      {
        "id": "0193f7c3-...",
        "name": "Tênis Nike Air Max",
        "slug": "tenis-nike-air-max",
        "price": 7500,
        "currency": "MZN",
        "image": "https://...",
        "category": {
          "id": "0193f7c4-...",
          "name": "Tênis"
        }
      }
    ]
  },
  "metadata": {
    "productCount": 12
  },
  "pagination": {
    "nextCursor": "0193f7c8-...",
    "hasMore": true,
    "limit": 10
  }
}
```

---

### `POST /api/stores/[slug]/follow`

Seguir uma loja.

```
POST /api/stores/loja-do-joao/follow
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "action": "followed"
}
```

**Error 401:**
```json
{
  "error": "Unauthorized"
}
```

---

### `DELETE /api/stores/[slug]/follow`

Deixar de seguir uma loja.

```
DELETE /api/stores/loja-do-joao/follow
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "action": "unfollowed"
}
```

---

### `GET /api/stores/[slug]/is-following`

Verifica se o user autenticado segue a loja.

```
GET /api/stores/loja-do-joao/is-following
Cookie: session=<httpOnly cookie> (opcional)
```

**Success 200:**
```json
{
  "isFollowing": true
}
```

---

### `GET /api/stores/followed`

Lojas seguidas pelo user autenticado (cursor pagination).

```
GET /api/stores/followed?limit=10&cursor=<last_id>
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "data": [
    {
      "followed_at": "2026-06-15T10:00:00.000Z",
      "store": {
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "logo_url": "https://...",
        "slug": "loja-do-joao",
        "state": "Maputo",
        "verified_at": "2026-05-01T00:00:00.000Z",
        "province": {
          "name": "Maputo"
        }
      }
    }
  ],
  "metaData": {
    "total": 15,
    "limit": 10,
    "nextCursor": "0193f7c9-..."
  }
}
```

---

## 6. Conversas / Mensagens

### `GET /api/conversations`

Inbox do user autenticado.

```
GET /api/conversations?page=1&limit=10
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "data": [
    {
      "conversationId": "0193f7ca-...",
      "productId": "0193f7c3-...",
      "lastMessageAt": "2026-07-07T14:30:00.000Z",
      "lastMessage": "Olá, ainda está disponível?",
      "isLastMessageMine": true,
      "unreadCount": 0,
      "store": {
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "logoUrl": "https://...",
        "slug": "loja-do-joao"
      }
    }
  ],
  "hasMore": false
}
```

---

### `POST /api/conversations`

Inicia (ou reutiliza) uma conversa com a loja de um produto.

```
POST /api/conversations
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "productId": "0193f7c3-...",
  "content": "Olá, ainda está disponível?" (opcional — se omitido, o user escreve depois)
}
```

**Success 201:**
```json
{
  "data": {
    "conversationId": "0193f7ca-..."
  }
}
```

**Error 400:**
```json
{
  "error": "productId is required"
}
```

**Error 404:**
```json
{
  "error": "Product not found"
}
```

---

### `GET /api/conversations/[id]`

Detalhes de uma conversa (store info).

```
GET /api/conversations/0193f7ca-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "data": {
    "conversationId": "0193f7ca-...",
    "productId": "0193f7c3-...",
    "store": {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "logoUrl": "https://...",
      "slug": "loja-do-joao",
      "state": "Maputo",
      "provinceName": "Maputo"
    }
  }
}
```

**Error 403:**
```json
{
  "error": "Forbidden"
}
```

---

### `GET /api/conversations/[id]/messages`

Mensagens de uma conversa (polling a cada 3s).

```
GET /api/conversations/0193f7ca-.../messages
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "data": [
    {
      "id": "0193f7cb-...",
      "conversation_id": "0193f7ca-...",
      "user_id": "0193f7c0-...",
      "store_id": null,
      "content": "Olá, ainda está disponível?",
      "status": "delivered",
      "created_at": "2026-07-07T14:30:00.000Z"
    },
    {
      "id": "0193f7cc-...",
      "conversation_id": "0193f7ca-...",
      "user_id": null,
      "store_id": "0193f7c2-...",
      "content": "Sim, está sim!",
      "status": "read",
      "created_at": "2026-07-07T14:31:00.000Z"
    }
  ]
}
```

---

### `POST /api/conversations/[id]/messages`

Enviar uma mensagem.

```
POST /api/conversations/0193f7ca-.../messages
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "content": "Olá, ainda está disponível?"
}
```

**Success 201:**
```json
{
  "data": {
    "id": "0193f7cb-...",
    "conversation_id": "0193f7ca-...",
    "user_id": "0193f7c0-...",
    "store_id": null,
    "content": "Olá, ainda está disponível?",
    "status": "delivered",
    "created_at": "2026-07-07T14:30:00.000Z"
  }
}
```

**Error 400:**
```json
{
  "error": "Content is required"
}
```

---

### `PATCH /api/conversations/[id]/read`

Marca a conversa como lida.

```
PATCH /api/conversations/0193f7ca-.../read
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true
}
```

---

## 7. Notificações

### `GET /api/notifications`

Lista notificações do user autenticado.

```
GET /api/notifications?limit=20&offset=0
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "0193f7cd-...",
      "userId": "0193f7c0-...",
      "type": "message",
      "title": "Nova mensagem",
      "body": "Loja do João enviou uma mensagem",
      "link": "/mensagens/0193f7ca-...",
      "readAt": null,
      "createdAt": "2026-07-07T14:30:00.000Z",
      "sender": {
        "type": "store",
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "avatarUrl": "https://..."
      }
    }
  ],
  "unreadCount": 3,
  "pagination": {
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### `PATCH /api/notifications`

Marca notificações como lidas.

```
PATCH /api/notifications
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "ids": ["0193f7cd-...", "0193f7ce-..."]
}
```

**Success 200:**
```json
{
  "success": true
}
```

**Error 400:**
```json
{
  "error": "O campo ids é obrigatório."
}
```

---

## 8. Pedidos

### `GET /api/orders`

Lista pedidos do comprador autenticado.

```
GET /api/orders
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "0193f7cf-...",
      "storeName": "Loja do João",
      "storeAvatar": "https://...",
      "date": "2026-07-01T10:00:00.000Z",
      "itemCount": 2,
      "total": 15000,
      "currency": "MZN",
      "status": "shipping",
      "statusLabel": "A caminho"
    }
  ]
}
```

---

### `GET /api/orders/[id]`

Detalhes de um pedido.

```
GET /api/orders/0193f7cf-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "order": {
    "id": "0193f7cf-...",
    "storeName": "Loja do João",
    "storeAvatar": "https://...",
    "date": "2026-07-01T10:00:00.000Z",
    "itemCount": 2,
    "total": 15000,
    "currency": "MZN",
    "status": "shipping",
    "statusLabel": "A caminho"
  },
  "storeSlug": "loja-do-joao",
  "items": [
    {
      "id": "0193f7d0-...",
      "quantity": 1,
      "unitPrice": 7500,
      "currency": "MZN",
      "productName": "Tênis Nike Air Max",
      "productSlug": "tenis-nike-air-max"
    }
  ]
}
```

---

## 9. Itens Salvos

### `GET /api/saved-items`

Lista produtos salvos pelo user.

```
GET /api/saved-items
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "items": [
    {
      "id": "0193f7d1-...",
      "imageUrl": "https://...",
      "name": "Tênis Nike Air Max",
      "storeName": "Loja do João",
      "price": 7500
    }
  ]
}
```

---

### `POST /api/saved-items/[id]`

Salva um produto.

```
POST /api/saved-items/0193f7c3-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "item": {
    "id": "0193f7d1-...",
    "user_id": "0193f7c0-...",
    "product_id": "0193f7c3-...",
    "created_at": "2026-07-07T14:30:00.000Z"
  }
}
```

**Error 409:**
```json
{
  "error": "Already saved"
}
```

---

### `DELETE /api/saved-items/[id]`

Remove um item salvo.

```
DELETE /api/saved-items/0193f7d1-...
Cookie: session=<httpOnly cookie>
```

**Success 204:** *(sem corpo)*

---

## 10. Uploads

### `POST /api/uploads/presign`

Gera URL presignada para upload de imagem (Cloudflare R2).

```
POST /api/uploads/presign
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "purpose": "product" | "logo" | "banner" | "document",
  "contentType": "image/jpeg" | "image/png" | "image/webp"
}
```

**Success 200:**
```json
{
  "url": "https://... (URL presignado para PUT)",
  "publicUrl": "https://... (URL pública da imagem)",
  "key": "uploads/products/0193f7c3-.../abc123.jpg"
}
```

**Error 400:**
```json
{
  "error": "Invalid upload purpose"
}
```

```json
{
  "error": "Only JPG, PNG, and WebP images are allowed"
}
```

---

## 11. Onboarding

### `POST /api/onboarding/role`

Define o papel do user (comprador ou vendedor).

```
POST /api/onboarding/role
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "role": "buyer" | "seller"
}
```

**Success 200:**
```json
{
  "success": true,
  "role": "seller"
}
```

**Error 400:**
```json
{
  "error": "Invalid role"
}
```

---

### `POST /api/onboarding/verification`

Submete documentos de verificação (seller).

```
POST /api/onboarding/verification
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "idCardUrl": "https://... (URL do presign)",
  "selfieUrl": "https://... (URL do presign)"
}
```

**Success 200:**
```json
{
  "success": true
}
```

**Error 400:**
```json
{
  "error": "Os documentos devem ser carregados para o armazenamento"
}
```

---

## 12. Seller

### `PATCH /api/seller/store`

Actualiza dados da loja.

```
PATCH /api/seller/store
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "logoUrl": "https://...",
  "bannerUrl": "https://...",
  "description": "Nova descrição",
  "phone": "+258840000001",
  "whatsapp": "+258840000001",
  "hasDelivery": true,
  "currentStep": "store_info"
}
```

**Success 200:**
```json
{
  "success": true,
  "store": {
    "id": "0193f7c2-...",
    "name": "Loja do João",
    "description": "Nova descrição",
    "phone": "+258840000001",
    "whatsapp": "+258840000001",
    "has_delivery": true,
    "logo_url": "https://...",
    "banner_url": "https://..."
  }
}
```

---

### `GET /api/seller/products`

Lista produtos da loja do seller.

```
GET /api/seller/products
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "products": [
    {
      "id": "0193f7c3-...",
      "name": "Tênis Nike Air Max",
      "price": 7500,
      "discountPrice": 6500,
      "currency": "MZN",
      "status": "ACTIVE",
      "isVisible": true,
      "categoryName": "Calçado",
      "image": "https://..."
    }
  ],
  "store": {
    "id": "0193f7c2-...",
    "slug": "loja-do-joao",
    "name": "Loja do João",
    "seller_profile_id": "0193f7c1-..."
  }
}
```

---

### `GET /api/seller/orders`

Pedidos recebidos pela loja do seller.

```
GET /api/seller/orders
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "0193f7cf-...",
      "storeName": "Loja do João",
      "storeAvatar": "https://...",
      "date": "2026-07-01T10:00:00.000Z",
      "itemCount": 2,
      "total": 15000,
      "currency": "MZN",
      "status": "pending",
      "statusLabel": "Pendente"
    }
  ]
}
```

---

## 13. Admin — Categorias

### `GET /api/admin/categories`

Lista categorias (admin).

```
GET /api/admin/categories
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "categories": [
    {
      "id": "0193f7c4-...",
      "parent_id": null,
      "name": "Calçado",
      "slug": "calcado",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/admin/categories`

Cria categoria.

```
POST /api/admin/categories
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "name": "Calçado",
  "slug": "calcado",
  "parentId": null
}
```

**Success 200:**
```json
{
  "category": {
    "id": "0193f7c4-...",
    "name": "Calçado",
    "slug": "calcado",
    "parent_id": null,
    "created_at": "2026-07-07T00:00:00.000Z"
  }
}
```

---

### `PATCH /api/admin/categories`

Actualiza categoria.

```
PATCH /api/admin/categories
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "id": "0193f7c4-...",
  "name": "Calçado Desportivo",
  "slug": "calcado-desportivo"
}
```

**Success 200:**
```json
{
  "success": true
}
```

---

### `DELETE /api/admin/categories`

Remove categoria (soft delete).

```
DELETE /api/admin/categories
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "id": "0193f7c4-..."
}
```

**Success 200:**
```json
{
  "success": true
}
```

---

## 14. Admin — Produtos

### `GET /api/admin/products`

Lista produtos com filtros (admin).

```
GET /api/admin/products?search=<term>&category=<id>&status=<status>&page=1&limit=20
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "products": [
    {
      "id": "0193f7c3-...",
      "name": "Tênis Nike Air Max",
      "description": "Tênis original...",
      "price": 7500,
      "discount_price": 6500,
      "currency": "MZN",
      "status": "ACTIVE",
      "is_visible": true,
      "created_at": "2026-06-10T08:00:00.000Z",
      "store_id": "0193f7c2-...",
      "category_id": "0193f7c4-...",
      "stores": {
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "slug": "loja-do-joao"
      },
      "categories": {
        "id": "0193f7c4-...",
        "name": "Calçado"
      },
      "product_images": [
        {
          "url": "https://...",
          "is_primary": true
        }
      ]
    }
  ]
}
```

---

### `PATCH /api/admin/products/[id]`

Actualiza produto (admin).

```
PATCH /api/admin/products/0193f7c3-...
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "name": "Novo Nome",
  "price": 8000,
  "status": "ACTIVE"
}
```

**Success 200:**
```json
{
  "success": true
}
```

---

### `DELETE /api/admin/products/[id]`

Remove produto (soft delete, admin).

```
DELETE /api/admin/products/0193f7c3-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true
}
```

---

## 15. Admin — Lojas

### `GET /api/admin/stores`

Lista lojas para moderação.

```
GET /api/admin/stores?status=PENDING&search=<term>
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "stores": [
    {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "slug": "loja-do-joao",
      "status": "PENDING",
      "description": "Loja de calçado...",
      "logo_url": "https://...",
      "banner_url": "https://...",
      "phone": "+258840000000",
      "whatsapp": "+258840000000",
      "email": "loja@example.com",
      "state": "Maputo",
      "created_at": "2026-06-10T08:00:00.000Z",
      "provinces": {
        "name": "Maputo"
      },
      "categories": {
        "id": "0193f7c4-...",
        "name": "Calçado"
      },
      "users": {
        "id": "0193f7c0-...",
        "first_name": "João",
        "last_name": "Silva",
        "email": "user@example.com",
        "phone_number": "+258840000000",
        "created_at": "2026-06-01T10:00:00.000Z"
      },
      "productCount": 12,
      "followerCount": 150
    }
  ]
}
```

---

### `GET /api/admin/stores/[id]`

Detalhes completos de uma loja (admin).

```
GET /api/admin/stores/0193f7c2-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "store": {
    "id": "0193f7c2-...",
    "name": "Loja do João",
    "slug": "loja-do-joao",
    "status": "PENDING",
    "description": "Loja de calçado...",
    "logo_url": "https://...",
    "banner_url": "https://...",
    "phone": "+258840000000",
    "whatsapp": "+258840000000",
    "email": "loja@example.com",
    "state": "Maputo",
    "neighborhood": "Sommerchild",
    "owner_id": "0193f7c0-...",
    "province_id": "0193f7c7-...",
    "created_at": "2026-06-10T08:00:00.000Z",
    "provinces": {
      "name": "Maputo"
    },
    "categories": {
      "id": "0193f7c4-...",
      "name": "Calçado"
    },
    "users": {
      "id": "0193f7c0-...",
      "first_name": "João",
      "last_name": "Silva",
      "email": "user@example.com",
      "phone_number": "+258840000000",
      "created_at": "2026-06-01T10:00:00.000Z",
      "avatar_url": "https://..."
    },
    "followerCount": 150
  },
  "docs": [
    {
      "id": "0193f7d2-...",
      "type": "ID_CARD",
      "status": "PENDING",
      "file_url": "https://...",
      "rejection_reason": null,
      "created_at": "2026-06-10T08:00:00.000Z"
    }
  ],
  "products": [
    {
      "id": "0193f7c3-...",
      "name": "Tênis Nike Air Max",
      "price": 7500,
      "currency": "MZN",
      "status": "ACTIVE",
      "created_at": "2026-06-10T08:00:00.000Z"
    }
  ]
}
```

---

### `PATCH /api/admin/stores/[id]`

Actualiza loja (admin — aprovação/rejeição).

```
PATCH /api/admin/stores/0193f7c2-...
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "status": "ACTIVE",
  "currentStep": "verification"
}
```

**Success 200:**
```json
{
  "store": {
    "id": "0193f7c2-...",
    "name": "Loja do João",
    "status": "ACTIVE"
  }
}
```

---

### `DELETE /api/admin/stores/[id]`

Remove loja (soft delete, admin).

```
DELETE /api/admin/stores/0193f7c2-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true
}
```

---

## 16. Admin — Utilizadores

### `GET /api/admin/users`

Lista utilizadores (admin).

```
GET /api/admin/users?search=<term>&status=<status>
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "users": [
    {
      "id": "0193f7c0-...",
      "first_name": "João",
      "last_name": "Silva",
      "email": "user@example.com",
      "phone_number": "+258840000000",
      "avatar_url": "https://...",
      "status": "ACTIVE",
      "created_at": "2026-06-01T10:00:00.000Z",
      "roles": ["buyer"],
      "store": {
        "id": "0193f7c2-...",
        "name": "Loja do João",
        "slug": "loja-do-joao",
        "status": "ACTIVE"
      }
    }
  ]
}
```

---

### `GET /api/admin/users/[id]`

Detalhes de um utilizador (admin).

```
GET /api/admin/users/0193f7c0-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "user": {
    "id": "0193f7c0-...",
    "firebase_uid": "abc123...",
    "email": "user@example.com",
    "first_name": "João",
    "last_name": "Silva",
    "phone_number": "+258840000000",
    "avatar_url": "https://...",
    "email_verified": true,
    "phone_verified": false,
    "status": "ACTIVE",
    "created_at": "2026-06-01T10:00:00.000Z",
    "updated_at": "2026-07-01T10:00:00.000Z",
    "roles": ["buyer", "seller"]
  },
  "store": {
    "id": "0193f7c2-...",
    "name": "Loja do João",
    "slug": "loja-do-joao",
    "status": "ACTIVE",
    "description": "Loja de calçado...",
    "logo_url": "https://...",
    "state": "Maputo",
    "created_at": "2026-06-10T08:00:00.000Z"
  }
}
```

---

### `PATCH /api/admin/users/[id]`

Actualiza utilizador (admin — concede/remove admin).

```
PATCH /api/admin/users/0193f7c0-...
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "role": "admin",
  "status": "BANNED"
}
```

**Success 200:**
```json
{
  "success": true
}
```

---

### `DELETE /api/admin/users/[id]`

Remove utilizador (soft delete, admin).

```
DELETE /api/admin/users/0193f7c0-...
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "success": true
}
```

---

## 17. Admin — Estatísticas

### `GET /api/admin/stats`

KPIs do painel admin com comparação percentual.

```
GET /api/admin/stats
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "totalUsers": 1250,
  "totalUsersPct": 12.5,
  "activeStores": 85,
  "activeStoresPct": 8.3,
  "pendingApprovals": 12,
  "totalProducts": 3400,
  "totalProductsPct": -2.1,
  "messagesToday": 456
}
```

---

### `GET /api/admin/analytics`

Séries temporais e top stores.

```
GET /api/admin/analytics?days=30
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "signupsByDay": [
    { "date": "2026-06-07", "count": 15 },
    { "date": "2026-06-08", "count": 22 }
  ],
  "productsByDay": [
    { "date": "2026-06-07", "count": 45 },
    { "date": "2026-06-08", "count": 38 }
  ],
  "storesByDay": [
    { "date": "2026-06-07", "count": 3 },
    { "date": "2026-06-08", "count": 5 }
  ],
  "approvalRate": 0.85,
  "topStores": [
    {
      "id": "0193f7c2-...",
      "name": "Loja do João",
      "slug": "loja-do-joao",
      "created_at": "2026-05-01T00:00:00.000Z",
      "products": 45,
      "followers": 230
    }
  ]
}
```

---

## 18. Admin — Notificações

### `GET /api/admin/notifications`

Lista notificações enviadas (agrupadas por lote).

```
GET /api/admin/notifications
Cookie: session=<httpOnly cookie>
```

**Success 200:**
```json
{
  "notifications": [
    {
      "id": "0193f7cd-...",
      "title": "Promoção de Julho",
      "body": "Aproveite 20% de desconto...",
      "type": "promotion",
      "created_at": "2026-07-01T00:00:00.000Z",
      "recipientCount": 450,
      "readCount": 120
    }
  ]
}
```

---

### `POST /api/admin/notifications`

Envia notificações em lote.

```
POST /api/admin/notifications
Cookie: session=<httpOnly cookie>
Content-Type: application/json

{
  "target": "all" | "buyers" | "sellers",
  "title": "Promoção de Julho",
  "body": "Aproveite 20% de desconto em toda a loja!",
  "type": "promotion",
  "link": "/feed/explorar"
}
```

**Success 200:**
```json
{
  "success": true,
  "notification": {
    "id": "0193f7cd-...",
    "target": "all",
    "title": "Promoção de Julho",
    "body": "Aproveite 20% de desconto...",
    "sentAt": "2026-07-07T14:30:00.000Z",
    "sentBy": "0193f7c0-..."
  },
  "recipientCount": 450
}
```

**Error 400:**
```json
{
  "error": "Missing required fields"
}
```

---

## Convenções

- **Soft delete:** Tabelas usam `deleted_at` timestamps. Rotas de listagem filtram com `.is('deleted_at', null)`.
- **IDs:** UUID v7 (`uuidv7()`).
- **Paginação cursor:** Usar `nextCursor` + `hasMore` para scroll infinito.
- **Paginação página:** Usar `page` + `limit` + `totalCount` para paginação clássica.
- **CamelCase vs snake_case:** A API devolve snake_case nas respostas raw da base de dados. Algumas rotas fazem mapping para camelCase no servidor. O mobile deve estar preparado para ambos os formatos e preferir seguir o que cada resposta devolver.
- **Moeda:** `currency` é sempre `"MZN"` por defeito. `price` e `discountPrice` estão em centavos (MZN 75,00 = 7500).
- **Autenticação:** Todas as rotas marcadas como "Sessão" requerem o cookie httpOnly. Para mobile, usar `credentials: 'include'` no fetch.

---

## Mapa de autenticação rápida

| Auth | Rotas |
|---|---|
| **Nenhuma** | `POST /api/auth/register`, `POST /api/auth/session`, `GET /api/categories`, `GET /api/provinces`, `GET /api/products`, `GET /api/products/[id]`, `GET /api/stores`, `GET /api/stores/[slug]`, `GET /api/stores/[slug]/products` |
| **Sessão (cookie)** | `GET /api/auth/me`, `POST /api/auth/logout`, `GET /api/me/profile`, `POST /api/stores/[slug]/follow`, `DELETE /api/stores/[slug]/follow`, `GET /api/stores/followed`, `GET /api/conversations`, `POST /api/conversations`, `GET /api/conversations/[id]`, `GET /api/conversations/[id]/messages`, `POST /api/conversations/[id]/messages`, `PATCH /api/conversations/[id]/read`, `GET /api/notifications`, `PATCH /api/notifications`, `GET /api/orders`, `GET /api/orders/[id]`, `GET /api/saved-items`, `POST /api/saved-items/[id]`, `DELETE /api/saved-items/[id]`, `POST /api/uploads/presign`, `POST /api/onboarding/role` |
| **Seller** | `POST /api/products`, `POST /api/stores`, `POST /api/onboarding/verification`, `PATCH /api/seller/store`, `GET /api/seller/products`, `GET /api/seller/orders` |
| **Admin** | `GET /api/admin/*`, `POST /api/admin/*`, `PATCH /api/admin/*`, `DELETE /api/admin/*`, `POST /api/categories` |

---

> **Nota para mobile:** O `GET /api/stores/[slug]/is-following` funciona sem autenticação (devolve `false`). Para obter o valor real, incluir o cookie de sessão.
