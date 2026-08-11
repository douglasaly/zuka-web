import { Building2, Home, MapPin } from 'lucide-react'

export const LABEL_ICONS: Record<string, typeof Home> = {
	Casa: Home,
	Trabalho: Building2,
	Outro: MapPin,
}

export const ADDRESS_LABELS = ['Casa', 'Trabalho', 'Outro'] as const
