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
import type { NotificationType } from '@/types/notifications'

export type NotificationMeta = {
	icon: LucideIcon
	bg: string
	fg: string
	border: string
	label: string
}

export const NOTIFICATION_META: Record<NotificationType, NotificationMeta> = {
	message: {
		icon: MessageCircle,
		bg: 'bg-blue-100',
		fg: 'text-blue-600',
		border: 'border-l-blue-500',
		label: 'Mensagem',
	},
	order: {
		icon: ShoppingBag,
		bg: 'bg-emerald-100',
		fg: 'text-emerald-600',
		border: 'border-l-emerald-500',
		label: 'Pedido',
	},
	offer: {
		icon: Tag,
		bg: 'bg-amber-100',
		fg: 'text-amber-600',
		border: 'border-l-amber-500',
		label: 'Oferta',
	},
	follow: {
		icon: UserPlus,
		bg: 'bg-purple-100',
		fg: 'text-purple-600',
		border: 'border-l-purple-500',
		label: 'Seguidor',
	},
	review: {
		icon: Star,
		bg: 'bg-orange-100',
		fg: 'text-orange-500',
		border: 'border-l-orange-500',
		label: 'Avaliação',
	},
	promotion: {
		icon: Megaphone,
		bg: 'bg-rose-100',
		fg: 'text-rose-500',
		border: 'border-l-rose-500',
		label: 'Promoção',
	},
	system: {
		icon: Bell,
		bg: 'bg-neutral-100',
		fg: 'text-neutral-500',
		border: 'border-l-neutral-400',
		label: 'Sistema',
	},
}
