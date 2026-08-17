'use client'
import { Loader2 } from 'lucide-react'
import type { CreateAddressInput } from '@/app/api/addresses/types'
import { Button } from '@/components/ui/button'
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
import type { ProvinceOption } from '../../hooks/use-addresses'
import { ADDRESS_LABELS } from '../components/addresses/constants'

type AddressesFormDialogProps = {
	open: boolean
	onOpenChange: (open: boolean) => void
	form: CreateAddressInput
	setForm: React.Dispatch<React.SetStateAction<CreateAddressInput>>
	provinces: ProvinceOption[]
	saving: boolean
	onSave: (e: React.FormEvent) => void
}
export function AddressesFormDialog({
	open,
	onOpenChange,
	form,
	setForm,
	provinces,
	saving,
	onSave,
}: AddressesFormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<form onSubmit={onSave}>
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
								{ADDRESS_LABELS.map((label) => (
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
								))}
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
							onClick={() => onOpenChange(false)}
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
	)
}
