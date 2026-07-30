'use client'

import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type Province = {
	id: string
	name: string
}

type StoreLocationSectionProps = {
	form: StoreFormState
	onChange: (patch: Partial<StoreFormState>) => void
}

export function StoreLocationSection({
	form,
	onChange,
}: StoreLocationSectionProps) {
	const { data: provinces = [], isLoading } = useQuery<Province[]>({
		queryKey: ['provinces'],
		queryFn: async () => {
			const res = await fetch('/api/provinces')
			if (!res.ok) throw new Error('Failed to load provinces')
			const json = await res.json()
			const rows = (
				Array.isArray(json) ? json : (json.data ?? [])
			) as Province[]
			return rows
		},
	})

	const provinceItems = provinces.map((p) => ({
		value: p.id,
		label: p.name,
	}))

	return (
		<StoreSection
			title='Localização'
			description='Província e bairro onde a loja opera.'
		>
			<div className='grid min-w-0 gap-4 sm:grid-cols-2'>
				<div className='min-w-0 space-y-2'>
					<Label>Província</Label>
					<Select
						items={provinceItems}
						value={form.provinceId || null}
						onValueChange={(provinceId) =>
							provinceId && onChange({ provinceId })
						}
						disabled={isLoading}
					>
						<SelectTrigger className='h-11 w-full'>
							<SelectValue
								placeholder={
									isLoading
										? 'A carregar...'
										: 'Seleccionar província'
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{provinces.map((p) => (
								<SelectItem key={p.id} value={p.id}>
									{p.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className='min-w-0 space-y-2'>
					<Label htmlFor='store-neighborhood'>Bairro / zona</Label>
					<Input
						id='store-neighborhood'
						value={form.neighborhood}
						onChange={(e) =>
							onChange({ neighborhood: e.target.value })
						}
						placeholder='Ex: Polana, Malhangalene'
						className='h-11'
					/>
				</div>
			</div>
		</StoreSection>
	)
}
