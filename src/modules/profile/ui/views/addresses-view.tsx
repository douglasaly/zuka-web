'use client'

import {
	ArrowLeft,
	Building2,
	Home,
	Loader2,
	MapPin,
	Plus,
	Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { Address, CreateAddressInput } from '@/app/api/addresses/types'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

const LABEL_ICONS: Record<string, typeof Home> = {
	Casa: Home,
	Trabalho: Building2,
	Outro: MapPin,
}

export const AddressesView = () => {
	const router = useRouter()
	const [addresses, setAddresses] = useState<Address[]>([])
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [deleting, setDeleting] = useState<string | null>(null)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [provinces, setProvinces] = useState<
		{ id: string; name: string; slug: string }[]
	>([])

	const [form, setForm] = useState<CreateAddressInput>({
		label: 'Casa',
		street: '',
		neighborhood: '',
		city: '',
		provinceSlug: '',
		phone: '',
		recipientName: '',
		isDefault: false,
	})

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
			setForm({
				label: 'Casa',
				street: '',
				neighborhood: '',
				city: '',
				provinceSlug: '',
				phone: '',
				recipientName: '',
				isDefault: false,
			})
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

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<div className='mb-8 flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<IconTooltipButton label='Voltar' onClick={() => router.back()}>
						<ArrowLeft className='size-4' />
					</IconTooltipButton>
					<div>
						<h1 className='font-heading text-2xl font-bold md:text-3xl'>
							Endereços
						</h1>
						<p className='text-sm text-muted-foreground'>
							Gerir os seus endereços de entrega
						</p>
					</div>
				</div>
				<Button
					onClick={() => setDialogOpen(true)}
					className='rounded-full'
				>
					<Plus className='mr-1.5 size-4' />
					Adicionar
				</Button>
			</div>

			{loading ? (
				<div className='flex items-center justify-center py-16'>
					<Loader2 className='size-6 animate-spin text-muted-foreground' />
				</div>
			) : addresses.length === 0 ? (
				<div className='flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/60 px-4 py-16 text-center'>
					<div className='flex size-14 items-center justify-center rounded-full bg-muted'>
						<MapPin className='size-7 text-muted-foreground' />
					</div>
					<div>
						<p className='text-lg font-medium'>
							Nenhum endereço registado
						</p>
						<p className='mt-1 text-sm text-muted-foreground'>
							Adicione um endereço para facilitar as suas compras
						</p>
					</div>
					<Button
						onClick={() => setDialogOpen(true)}
						variant='outline'
						className='rounded-full'
					>
						<Plus className='mr-1.5 size-4' />
						Adicionar endereço
					</Button>
				</div>
			) : (
				<div className='space-y-3'>
					{addresses.map((address) => {
						const Icon = LABEL_ICONS[address.label] ?? MapPin

						return (
							<Card
								key={address.id}
								className={`border-border/60 transition-colors ${
									address.isDefault
										? 'border-secondary/30 bg-secondary/[0.03]'
										: ''
								}`}
							>
								<CardContent className='flex items-start gap-4 p-4 md:p-5'>
									<div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10'>
										<Icon className='size-5 text-secondary' />
									</div>

									<div className='min-w-0 flex-1'>
										<div className='flex items-center gap-2'>
											<p className='text-sm font-semibold'>
												{address.label}
											</p>
											{address.isDefault && (
												<span className='rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-medium text-secondary'>
													Padrão
												</span>
											)}
										</div>
										<p className='mt-0.5 text-sm text-muted-foreground'>
											{address.street}
										</p>
										<p className='text-xs text-muted-foreground'>
											{[
												address.neighborhood,
												address.city,
												address.provinceName,
											]
												.filter(Boolean)
												.join(', ')}
										</p>
									</div>

									<div className='flex shrink-0 items-center gap-1'>
										{!address.isDefault && (
											<IconTooltipButton
												label='Definir como padrão'
												onClick={() =>
													handleSetDefault(address.id)
												}
											>
												<MapPin className='size-4 text-muted-foreground' />
											</IconTooltipButton>
										)}
										<IconTooltipButton
											label='Remover'
											onClick={() =>
												handleDelete(address.id)
											}
											disabled={deleting === address.id}
										>
											{deleting === address.id ? (
												<Loader2 className='size-4 animate-spin text-destructive' />
											) : (
												<Trash2 className='size-4 text-destructive/70' />
											)}
										</IconTooltipButton>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			)}

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className='sm:max-w-md'>
					<form onSubmit={handleSave}>
						<DialogHeader>
							<DialogTitle className='font-heading'>
								Novo endereço
							</DialogTitle>
							<DialogDescription>
								Preencha os dados do seu endereço de entrega
							</DialogDescription>
						</DialogHeader>

						<div className='space-y-4 py-4'>
							<div className='space-y-2'>
								<Label>Identificação</Label>
								<div className='flex gap-2'>
									{['Casa', 'Trabalho', 'Outro'].map(
										(label) => (
											<Button
												key={label}
												type='button'
												variant={
													form.label === label
														? 'default'
														: 'outline'
												}
												size='sm'
												onClick={() =>
													setForm({
														...form,
														label,
													})
												}
												className='rounded-full'
											>
												{label}
											</Button>
										)
									)}
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='recipientName'>
									Nome do destinatário
								</Label>
								<Input
									id='recipientName'
									placeholder='Nome completo'
									value={form.recipientName}
									onChange={(e) =>
										setForm({
											...form,
											recipientName: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='phone'>Telefone</Label>
								<Input
									id='phone'
									placeholder='+258 84 123 4567'
									value={form.phone}
									onChange={(e) =>
										setForm({
											...form,
											phone: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='street'>Rua/Avenida</Label>
								<Input
									id='street'
									placeholder='Av. Acordos de Lusaka, nº 123'
									value={form.street}
									onChange={(e) =>
										setForm({
											...form,
											street: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='neighborhood'>Bairro</Label>
								<Input
									id='neighborhood'
									placeholder='Sommerschield'
									value={form.neighborhood}
									onChange={(e) =>
										setForm({
											...form,
											neighborhood: e.target.value,
										})
									}
									required
								/>
							</div>

							<div className='grid grid-cols-2 gap-3'>
								<div className='space-y-2'>
									<Label htmlFor='city'>Cidade</Label>
									<Input
										id='city'
										placeholder='Maputo'
										value={form.city}
										onChange={(e) =>
											setForm({
												...form,
												city: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='province'>Província</Label>
									<Select
										value={form.provinceSlug}
										onValueChange={(v) =>
											setForm({
												...form,
												provinceSlug: v ?? undefined,
											})
										}
									>
										<SelectTrigger id='province'>
											<SelectValue placeholder='Selecionar' />
										</SelectTrigger>
										<SelectContent>
											{provinces.map((p) => (
												<SelectItem
													key={p.slug}
													value={p.slug}
												>
													{p.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type='button'
								variant='outline'
								onClick={() => setDialogOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								type='submit'
								disabled={saving}
								className='rounded-full'
							>
								{saving ? (
									<>
										<Loader2 className='mr-2 size-4 animate-spin' />
										A salvar...
									</>
								) : (
									'Salvar'
								)}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
