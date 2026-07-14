import { z } from 'zod'

// ─── Paginação ──────────────────────────────────────────

/** Schema para query params de paginação offset-based (admin, lists com page numbers). */
export const OffsetPaginationSchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	offset: z.coerce.number().int().min(0).default(0),
})

/** Schema para query params de paginação cursor-based (infinite scroll). */
export const CursorPaginationSchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: z.string().optional(),
})

// ─── Produtos ───────────────────────────────────────────

export const ProductFiltersSchema = z.object({
	categoria: z.string().optional(),
	search: z.string().optional(),
	provincia: z.string().optional(),
	preco_min: z.coerce.number().optional(),
	preco_max: z.coerce.number().optional(),
	recente: z.enum(['true', 'false']).optional(),
	ordenar: z
		.enum(['price_asc', 'price_desc', 'newest', 'popular'])
		.optional(),
})

export const CreateProductSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório').max(255),
	description: z.string().max(5000).optional(),
	categoryId: z.string().uuid('Categoria inválida'),
	price: z.number().positive('Preço deve ser positivo'),
	discountPrice: z.number().positive().optional(),
	currency: z.string().length(3).default('MZN'),
	quantity: z.number().int().min(0).default(1),
	imageUrl: z.string().url().optional(),
})

// ─── Lojas ──────────────────────────────────────────────

export const StoreFiltersSchema = z.object({
	search: z.string().optional(),
	status: z
		.enum(['ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'BANNED'])
		.optional(),
})

export const CreateStoreSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório').max(150),
	description: z.string().max(2000).optional(),
	provinceId: z.string().uuid('Província inválida'),
	categoryId: z.string().uuid().optional(),
	neighborhood: z.string().min(1, 'Bairro é obrigatório'),
	email: z.string().email().optional(),
	phone: z.string().optional(),
	whatsapp: z.string().optional(),
})

// ─── Conversas ──────────────────────────────────────────

export const CreateConversationSchema = z.object({
	productId: z.string().uuid('Produto inválido'),
	content: z.string().max(2000).optional(),
})

export const SendMessageSchema = z.object({
	content: z
		.string()
		.min(1, 'Mensagem não pode estar vazia')
		.max(2000, 'Mensagem muito longa'),
})

// ─── Notificações ───────────────────────────────────────

export const MarkNotificationsReadSchema = z.object({
	ids: z.array(z.string().uuid()).min(1, 'Selecione notificações'),
})

// ─── Utilitários ────────────────────────────────────────

/** Parse e valida query params de um request. Retorna dados validados ou erro. */
export function parseQueryParams<T extends z.ZodType>(
	searchParams: URLSearchParams,
	schema: T
): z.infer<T> {
	const raw: Record<string, unknown> = {}
	for (const [key, value] of searchParams.entries()) {
		raw[key] = value
	}
	return schema.parse(raw)
}

/** Parse e valida o body de um request JSON. */
export async function parseBody<T extends z.ZodType>(
	request: Request,
	schema: T
): Promise<z.infer<T>> {
	const body = await request.json()
	return schema.parse(body)
}
