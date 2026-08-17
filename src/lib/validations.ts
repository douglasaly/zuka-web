import { z } from 'zod'
import {
	isAllowedStoreEmail,
	isValidMzMobile,
	STORE_FORM_MESSAGES,
	toE164Mz,
} from '@/lib/validations/store-form'
export const OffsetPaginationSchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	offset: z.coerce.number().int().min(0).default(0),
})
export const CursorPaginationSchema = z.object({
	limit: z.coerce.number().int().min(1).max(100).default(20),
	cursor: z.string().optional(),
})
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
	categoryId: z.uuid('Categoria inválida'),
	price: z.number().positive('Preço deve ser positivo'),
	discountPrice: z.number().positive().optional(),
	currency: z.string().length(3).default('MZN'),
	imageUrl: z.string().url().optional(),
	imageUrls: z.array(z.string().url()).max(8).optional(),
	status: z.enum(['DRAFT', 'ACTIVE', 'INACTIVE']).optional(),
})
export const StoreFiltersSchema = z.object({
	search: z.string().optional(),
	status: z
		.enum(['ACTIVE', 'PENDING', 'INACTIVE', 'SUSPENDED', 'BANNED'])
		.optional(),
})
const mzPhoneOptional = z
	.union([z.string(), z.null()])
	.optional()
	.refine(
		(v) => v == null || v === '' || isValidMzMobile(v),
		STORE_FORM_MESSAGES.phoneInvalid
	)
	.transform((v) => {
		if (v == null || v === '') return undefined
		return toE164Mz(v) || undefined
	})
const mzPhoneRequired = z
	.string()
	.min(1, STORE_FORM_MESSAGES.phoneInvalid)
	.refine(isValidMzMobile, STORE_FORM_MESSAGES.phoneInvalid)
	.transform((v) => toE164Mz(v))
function normalizePatchPhone(
	v: string | null | undefined
): string | null | undefined {
	if (v === undefined) return undefined
	if (v === null || v === '') return null
	return toE164Mz(v) || null
}
export const CreateStoreSchema = z.object({
	name: z.string().min(1, 'Nome é obrigatório').max(150),
	description: z
		.string()
		.min(20, STORE_FORM_MESSAGES.descriptionMin)
		.max(2000)
		.optional(),
	provinceId: z.uuid('Província inválida'),
	categoryId: z.uuid().optional(),
	neighborhood: z.string().min(1, 'Bairro é obrigatório'),
	email: z
		.string()
		.min(1, 'E-mail é obrigatório')
		.email(STORE_FORM_MESSAGES.emailInvalid)
		.refine(isAllowedStoreEmail, STORE_FORM_MESSAGES.emailPlaceholder),
	phone: mzPhoneRequired,
	whatsapp: mzPhoneOptional,
})
export const UpdateSellerStoreSchema = z
	.object({
		name: z.string().min(1).max(150).optional(),
		slug: z.string().optional(),
		logoUrl: z.string().nullable().optional(),
		bannerUrl: z.string().nullable().optional(),
		description: z.union([z.string(), z.null()]).optional(),
		phone: z.union([z.string(), z.null()]).optional(),
		whatsapp: z.union([z.string(), z.null()]).optional(),
		email: z.union([z.string(), z.null()]).optional(),
		provinceId: z.uuid().nullable().optional(),
		neighborhood: z.string().optional(),
		status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
		hasDelivery: z.boolean().optional(),
		deliveryZones: z.array(z.string()).optional(),
		currentStep: z.string().optional(),
	})
	.superRefine((data, ctx) => {
		if (
			data.currentStep &&
			typeof data.description === 'string' &&
			data.description.trim().length < 20
		) {
			ctx.addIssue({
				code: 'custom',
				message: STORE_FORM_MESSAGES.descriptionMin,
				path: ['description'],
			})
		}
		for (const key of ['phone', 'whatsapp'] as const) {
			const value = data[key]
			if (
				typeof value === 'string' &&
				value.length > 0 &&
				!isValidMzMobile(value)
			) {
				ctx.addIssue({
					code: 'custom',
					message: STORE_FORM_MESSAGES.phoneInvalid,
					path: [key],
				})
			}
		}
		if (typeof data.email === 'string' && data.email.trim()) {
			const email = data.email.trim()
			const emailCheck = z.string().email().safeParse(email)
			if (!emailCheck.success) {
				ctx.addIssue({
					code: 'custom',
					message: STORE_FORM_MESSAGES.emailInvalid,
					path: ['email'],
				})
			} else if (!isAllowedStoreEmail(email)) {
				ctx.addIssue({
					code: 'custom',
					message: STORE_FORM_MESSAGES.emailPlaceholder,
					path: ['email'],
				})
			}
		}
		if (data.hasDelivery && data.currentStep) {
			const hasWhatsapp =
				typeof data.whatsapp === 'string' && data.whatsapp.length > 0
			const hasPhone =
				typeof data.phone === 'string' && data.phone.length > 0
			if (!hasWhatsapp && !hasPhone) {
				ctx.addIssue({
					code: 'custom',
					message: STORE_FORM_MESSAGES.deliveryContactRequired,
					path: ['whatsapp'],
				})
			}
		}
	})
	.transform((data) => ({
		...data,
		phone: normalizePatchPhone(data.phone),
		whatsapp: normalizePatchPhone(data.whatsapp),
		email:
			data.email === undefined
				? undefined
				: data.email === null || data.email === ''
					? null
					: data.email.trim(),
	}))
export const CreateConversationSchema = z.object({
	productId: z.uuid('Produto inválido'),
	content: z.string().max(2000).optional(),
})
export const CreateBuyerOrderSchema = z.object({
	storeId: z.uuid('Loja inválida'),
	items: z
		.array(
			z.object({
				productId: z.uuid('Produto inválido'),
				quantity: z.number().int().min(1).max(99),
			})
		)
		.min(1, 'Adiciona pelo menos um produto')
		.max(50, 'Demasiados itens neste pedido'),
})
export const SendMessageSchema = z.object({
	content: z
		.string()
		.min(1, 'Mensagem não pode estar vazia')
		.max(2000, 'Mensagem muito longa'),
})
const notificationIds = z
	.array(z.uuid('Notificação inválida'))
	.min(1, 'Selecione notificações')
	.max(100, 'Demasiadas notificações de uma vez')
export const UpdateNotificationsSchema = z
	.object({
		ids: notificationIds.optional(),
		all: z.boolean().optional(),
		read: z.boolean().optional(),
		restore: z.boolean().optional(),
	})
	.refine((value) => value.all === true || value.ids != null, {
		message: 'Indique as notificações a actualizar',
	})
export const DeleteNotificationsSchema = z.object({
	ids: notificationIds,
})
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
export async function parseBody<T extends z.ZodType>(
	request: Request,
	schema: T
): Promise<z.infer<T>> {
	const body = await request.json()
	return schema.parse(body)
}
