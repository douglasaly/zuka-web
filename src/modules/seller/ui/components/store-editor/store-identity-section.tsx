'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slug } from '@/utils/slug'
import { DESCRIPTION_MAX } from './constants'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type StoreIdentitySectionProps = {
	form: StoreFormState
	onChange: (patch: Partial<StoreFormState>) => void
}

export function StoreIdentitySection({
	form,
	onChange,
}: StoreIdentitySectionProps) {
	return (
		<StoreSection
			title='Identidade'
			description='Nome, URL pública e descrição da loja.'
		>
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='store-name'>Nome da loja</Label>
					<Input
						id='store-name'
						value={form.name}
						onChange={(e) => {
							const name = e.target.value
							onChange({
								name,
								slug: form.slug ? form.slug : Slug(name),
							})
						}}
						placeholder='Ex: Moda Maputo'
						maxLength={150}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='store-slug'>Slug (URL)</Label>
					<div className='flex overflow-hidden rounded-lg border border-input'>
						<span className='flex items-center bg-muted px-3 text-sm text-muted-foreground'>
							zuka.co.mz/
						</span>
						<Input
							id='store-slug'
							disabled
							value={form.slug}
							className='rounded-none border-0 shadow-none focus-visible:ring-0'
							placeholder='moda-maputo'
						/>
					</div>
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between gap-2'>
						<Label htmlFor='store-description'>Descrição</Label>
						<span className='text-xs text-muted-foreground'>
							{form.description.length}/{DESCRIPTION_MAX}
						</span>
					</div>
					<Textarea
						id='store-description'
						value={form.description}
						onChange={(e) =>
							onChange({
								description: e.target.value.slice(
									0,
									DESCRIPTION_MAX
								),
							})
						}
						placeholder='Conte quem é, o que vende e porque os clientes devem escolher a sua loja...'
						className='min-h-28 resize-y'
					/>
				</div>
			</div>
		</StoreSection>
	)
}
