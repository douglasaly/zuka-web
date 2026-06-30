'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

export const DangerZone = () => {
	const [open, setOpen] = useState(false)

	return (
		<section className='space-y-3'>
			<div>
				<h2 className='text-base font-semibold text-destructive'>
					Zona de perigo
				</h2>
				<p className='text-sm text-muted-foreground'>
					Estas ações são permanentes e não podem ser desfeitas
				</p>
			</div>

			<div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger
						render={
							<Button variant='destructive' size='sm'>
								Eliminar conta
							</Button>
						}
					/>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Eliminar a sua conta?</DialogTitle>
							<DialogDescription>
								Esta ação é permanente. Todos os seus dados,
								pedidos e itens guardados serão removidos e não
								poderão ser recuperados.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant='outline'
								onClick={() => setOpen(false)}
							>
								Cancelar
							</Button>
							<Button
								variant='destructive'
								onClick={() => {
									// TODO: chamar API para eliminar conta
									setOpen(false)
								}}
							>
								Sim, eliminar
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</section>
	)
}
