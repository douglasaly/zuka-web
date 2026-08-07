import {
	CheckCircle2,
	type LucideIcon,
	MessageCircle,
	Truck,
} from 'lucide-react'

export type SignupFlowStep =
	| 'role'
	| 'buyer-form'
	| 'buyer-welcome'
	| 'seller-1'
	| 'seller-2'
	| 'seller-3'
	| 'seller-4'

export type SignupProvince = {
	id: string
	name: string
}

export type SignupCategory = {
	id: string
	name: string
}

export type BuyerFormState = {
	name: string
	email: string
	password: string
}

export type SellerAccountFormState = {
	storeName: string
	neighborhood: string
	email: string
	password: string
	confirmPassword: string
	categoryId: string
	provinceId: string
	phone: string
}

export type SellerProfileFormState = {
	logoUrl: string | null
	bannerUrl: string | null
	description: string
	hasDelivery: boolean
	whatsapp: string
	phone: string
}

export type SellerVerificationFormState = {
	idCardUrl: string | null
	selfieUrl: string | null
}

export type BuyerFeature = {
	icon: LucideIcon
	iconClass: string
	title: string
	description: string
}

export const BUYER_FEATURES: BuyerFeature[] = [
	{
		icon: CheckCircle2,
		iconClass: 'bg-emerald-50 text-emerald-600',
		title: 'Lojas verificadas',
		description:
			'Todas as lojas são verificadas pela nossa Equipe para garantir confiança',
	},
	{
		icon: Truck,
		iconClass: 'bg-red-50 text-secondary',
		title: 'Entrega em Maputo',
		description:
			'Entrega ao domicílio disponível em Maputo Cidade, Matola e mais',
	},
	{
		icon: MessageCircle,
		iconClass: 'bg-emerald-50 text-emerald-600',
		title: 'Contacto via WhatsApp',
		description:
			'Fala diretamente com o vendedor pelo WhatsApp para tirar dúvidas',
	},
]

export const INITIAL_BUYER_FORM: BuyerFormState = {
	name: '',
	email: '',
	password: '',
}

export const INITIAL_SELLER_ACCOUNT_FORM: SellerAccountFormState = {
	storeName: '',
	neighborhood: '',
	email: '',
	password: '',
	confirmPassword: '',
	categoryId: '',
	provinceId: '',
	phone: '',
}

export const INITIAL_SELLER_PROFILE_FORM: SellerProfileFormState = {
	logoUrl: null,
	bannerUrl: null,
	description: '',
	hasDelivery: false,
	whatsapp: '',
	phone: '',
}

export const INITIAL_SELLER_VERIFICATION_FORM: SellerVerificationFormState = {
	idCardUrl: null,
	selfieUrl: null,
}
