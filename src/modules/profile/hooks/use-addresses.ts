'use client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Address, CreateAddressInput } from '@/types'
export type ProvinceOption = {
	id: string
	name: string
	slug: string
}
function createEmptyForm(): CreateAddressInput {
	return {
		label: 'Casa',
		street: '',
		neighborhood: '',
		city: '',
		provinceSlug: '',
		phone: '',
		recipientName: '',
		isDefault: false,
	}
}
export function useAddresses() {
	const [addresses, setAddresses] = useState<Address[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [deleting, setDeleting] = useState<string | null>(null)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [provinces, setProvinces] = useState<ProvinceOption[]>([])
	const [form, setForm] = useState<CreateAddressInput>(createEmptyForm)
	const loadAddresses = useCallback(async () => {
		try {
			const res = await fetch('/api/addresses')
			if (!res.ok) throw new Error()
			const data = await res.json()
			setAddresses(data.addresses ?? [])
		} catch {
			toast.error('Erro ao carregar endereços')
		} finally {
			setLoading(false)
		}
	}, [])
	useEffect(() => {
		loadAddresses()
		fetch('/api/provinces')
			.then((r) => r.json())
			.then((data) => setProvinces(data ?? []))
			.catch(() => {})
	}, [loadAddresses])
	async function handleSave(e: React.FormEvent) {
		e.preventDefault()
		setSaving(true)
		try {
			const res = await fetch('/api/addresses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})
			if (!res.ok) throw new Error()
			toast.success('Endereço adicionado')
			setDialogOpen(false)
			setForm(createEmptyForm())
			loadAddresses()
		} catch {
			toast.error('Erro ao salvar endereço')
		} finally {
			setSaving(false)
		}
	}
	async function handleDelete(id: string) {
		setDeleting(id)
		try {
			const res = await fetch(`/api/addresses/${id}`, {
				method: 'DELETE',
			})
			if (!res.ok) throw new Error()
			toast.success('Endereço removido')
			setAddresses((prev) => prev.filter((a) => a.id !== id))
		} catch {
			toast.error('Erro ao remover endereço')
		} finally {
			setDeleting(null)
		}
	}
	async function handleSetDefault(id: string) {
		try {
			const res = await fetch(`/api/addresses/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ isDefault: true }),
			})
			if (!res.ok) throw new Error()
			loadAddresses()
		} catch {
			toast.error('Erro ao definir endereço padrão')
		}
	}
	return {
		addresses,
		loading,
		saving,
		deleting,
		dialogOpen,
		setDialogOpen,
		provinces,
		form,
		setForm,
		handleSave,
		handleDelete,
		handleSetDefault,
	}
}
