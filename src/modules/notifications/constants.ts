import type { LucideIcon } from 'lucide-react'
import {
	Bell,
	Megaphone,
	MessageCircle,
	ShoppingBag,
	Star,
	Tag,
	UserPlus,
} from 'lucide-react'
import type { NotificationType } from '@/types'
export type NotificationMeta = {
	icon: LucideIcon
	tint: string
	label: string
	plural: string
	action: string
}
export const NOTIFICATION_META: Record<NotificationType, NotificationMeta> = {
	message: {
		icon: MessageCircle,
		tint: 'bg-blue-500/12 text-blue-700 dark:text-blue-300',
		label: 'Mensagem',
		plural: 'Mensagens',
		action: 'Abrir conversa',
	},
	order: {
		icon: ShoppingBag,
		tint: 'bg-gray-100 text-emerald-700 dark:text-emerald-300',
		label: 'Pedido',
		plural: 'Pedidos',
		action: 'Ver pedido',
	},
	offer: {
		icon: Tag,
		tint: 'bg-gray-100 text-amber-700 dark:text-amber-300',
		label: 'Oferta',
		plural: 'Ofertas',
		action: 'Ver oferta',
	},
	follow: {
		icon: UserPlus,
		tint: 'bg-gray-100 text-violet-700 dark:text-violet-300',
		label: 'Seguidor',
		plural: 'Seguidores',
		action: 'Ver perfil',
	},
	review: {
		icon: Star,
		tint: 'bg-gray-100 text-orange-700 dark:text-orange-300',
		label: 'Avaliação',
		plural: 'Avaliações',
		action: 'Ver avaliação',
	},
	promotion: {
		icon: Megaphone,
		tint: 'bg-gray-100 text-rose-700 dark:text-rose-300',
		label: 'Promoção',
		plural: 'Promoções',
		action: 'Ver promoção',
	},
	system: {
		icon: Bell,
		tint: 'bg-muted text-muted-foreground',
		label: 'Sistema',
		plural: 'Sistema',
		action: 'Ver detalhes',
	},
}
export const NOTIFICATION_TYPE_ORDER: NotificationType[] = [
	'order',
	'message',
	'review',
	'offer',
	'promotion',
	'follow',
	'system',
]
export type NotificationFilter = NotificationType | 'all' | 'unread'
export const NOTIFICATION_UNREAD_SURFACE =
	'bg-secondary/[0.05] dark:bg-secondary/[0.1]'
