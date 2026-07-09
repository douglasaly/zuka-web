'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SettingField } from '../../../constants'

type AccountFieldsFormProps = {
	fields: SettingField[]
}

export const AccountFieldsForm = ({ fields }: AccountFieldsFormProps) => {
	const queryClient = useQueryClient()
	const [values, setValues] = useState<Record<string, string>>({})
	const [isSaving, setIsSaving] = useState(false)

	useEffect(() => {
		setValues(Object.fromEntries(fields.map((f) => [f.id, f.value])))
	}, [fields])

	const handleChange = (id: string, value: string) => {
		setValues((prev) => ({ ...prev, [id]: value }))
	}

	const handleSave = async () => {
		setIsSaving(true)
		try {
			const res = await fetch('/api/me/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName: values.firstName,
					lastName: values.lastName,
					phoneNumber: values.phone,
				}),
			})

			if (!res.ok) {
				const err = await res.json().catch(() => ({}))
				throw new Error(err.error ?? 'Erro ao guardar')
			}

			await queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			toast.success('Perfil atualizado com sucesso')
		} catch (err) {
			toast.error(
				err instanceof Error
					? err.message
					: 'Erro ao guardar alterações'
			)
		} finally {
			setIsSaving(false)
		}
	}

	if (fields.length === 0) {
		return (
			<div className='space-y-4 p-4'>
				<div className='grid gap-4 sm:grid-cols-2'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className='space-y-1.5'>
							<div className='h-3.5 w-16 rounded bg-muted' />
							<div className='h-9 w-full rounded bg-muted' />
						</div>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-4 p-4'>
			<div className='grid gap-4 sm:grid-cols-2'>
				{fields.map((field) => (
					<div key={field.id} className='space-y-1.5'>
						<Label htmlFor={field.id}>{field.label}</Label>
						<Input
							id={field.id}
							type={field.type}
							value={values[field.id] ?? ''}
							disabled={field.id === 'email'}
							onChange={(e) =>
								handleChange(field.id, e.target.value)
							}
						/>
					</div>
				))}
			</div>

			<div className='flex justify-end'>
				<Button onClick={handleSave} disabled={isSaving}>
					{isSaving ? 'A guardar...' : 'Guardar alterações'}
				</Button>
			</div>
		</div>
	)
}
