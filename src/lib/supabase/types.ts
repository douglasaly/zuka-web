export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

type DefaultRow = Record<string, unknown>
type DefaultInsert = Record<string, unknown>
type DefaultTable = {
	Row: DefaultRow
	Insert: DefaultInsert
	Update: DefaultInsert
	Relationships: []
}

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string
					firebase_uid: string
					email: string | null
					first_name: string | null
					last_name: string | null
					avatar_url: string | null
					phone_number: string | null
					email_verified: boolean | null
					phone_verified: boolean | null
					status: string | null
					created_at: string | null
					updated_at: string | null
					deleted_at: string | null
				}
				Insert: {
					id?: string
					firebase_uid: string
					email?: string | null
					first_name?: string | null
					last_name?: string | null
					avatar_url?: string | null
					phone_number?: string | null
					email_verified?: boolean | null
					phone_verified?: boolean | null
					status?: string | null
					created_at?: string | null
					updated_at?: string | null
					deleted_at?: string | null
				}
				Update: Partial<Database['public']['Tables']['users']['Insert']>
				Relationships: []
			}
			categories: DefaultTable
			provinces: DefaultTable
			stores: DefaultTable
			products: DefaultTable
			product_images: DefaultTable
			product_stock: DefaultTable
			product_variants: DefaultTable
			roles: DefaultTable
			permissions: DefaultTable
			role_permissions: DefaultTable
			user_roles: DefaultTable
			seller_profiles: DefaultTable
			seller_onboarding: DefaultTable
			seller_onboarding_steps: DefaultTable
			store_followers: DefaultTable
			conversations: DefaultTable
			conversation_participants: DefaultTable
			messages: DefaultTable
			message_products: DefaultTable
			verification_documents: DefaultTable
			orders: DefaultTable
			order_items: DefaultTable
		}
		Views: Record<string, never>
		Functions: Record<string, never>
		Enums: Record<string, never>
		CompositeTypes: Record<string, never>
	}
}
