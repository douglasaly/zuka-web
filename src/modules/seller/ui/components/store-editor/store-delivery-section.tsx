'use client'

import { Plus, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type StoreDeliverySectionProps = {
	form: StoreFormState
	onChange: (patch: Partial<StoreFormState>) => void
}

export function StoreDeliverySection({
	form,
	onChange,
}: StoreDeliverySectionProps) {
	function addZone() {
		const zone = form.zoneDraft.trim()
		if (!zone) return
		if (form.deliveryZones.includes(zone)) {
			onChange({ zoneDraft: '' })
			return
		}
		onChange({
			deliveryZones: [...form.deliveryZones, zone],
			zoneDraft: '',
		})
	}

	return (
		<StoreSection
			title='Entrega'
		>
			<div className='min-w-0 space-y-5'>
				<div className='flex min-w-0 items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-3'>
					<div className='min-w-0'>
						<p className='text-sm font-medium'>Faz entregas?</p>
						<p className='text-xs text-muted-foreground'>
							Active para configurar zonas e preços.
						</p>
					</div>
					<Switch
						checked={form.hasDelivery}
						onCheckedChange={(hasDelivery) =>
							onChange({ hasDelivery })
						}
					/>
				</div>

				{form.hasDelivery ? (
					<div className='grid min-w-0 gap-4 sm:grid-cols-2'>
						<div className='min-w-0 space-y-2'>
							<Label htmlFor='delivery-fee'>
								Preço da entrega (MZN)
							</Label>
							<Input
								id='delivery-fee'
								type='number'
								min={0}
								value={form.deliveryFee}
								onChange={(e) =>
									onChange({ deliveryFee: e.target.value })
								}
								placeholder='0'
								className='h-11'
							/>
						</div>
						<div className='min-w-0 space-y-2'>
							<Label htmlFor='delivery-eta'>
								Tempo estimado (minutos)
							</Label>
							<Input
								id='delivery-eta'
								type='number'
								min={0}
								value={form.deliveryEtaMinutes}
								onChange={(e) =>
									onChange({
										deliveryEtaMinutes: e.target.value,
									})
								}
								placeholder='45'
								className='h-11'
							/>
						</div>
						<div className='min-w-0 space-y-2 sm:col-span-2'>
							<Label>Zonas de entrega</Label>
							<div className='flex min-w-0 gap-2'>
								<Input
									value={form.zoneDraft}
									onChange={(e) =>
										onChange({ zoneDraft: e.target.value })
									}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault()
											addZone()
										}
									}}
									placeholder='Ex: Costa do Sol, Matola'
									className='h-11 min-w-0'
								/>
								<IconTooltipButton
									label='Adicionar zona'
									variant='outline'
									size='icon'
									className='size-11 shrink-0'
									onClick={addZone}
								>
									<Plus className='size-4' />
								</IconTooltipButton>
							</div>
							{form.deliveryZones.length > 0 ? (
								<ul className='mt-2 flex flex-wrap gap-2'>
									{form.deliveryZones.map((zone) => (
										<li
											key={zone}
											className='inline-flex max-w-full items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium'
										>
											<span className='truncate'>
												{zone}
											</span>
											<Tooltip>
												<TooltipTrigger
													render={
														<button
															type='button'
															onClick={() =>
																onChange({
																	deliveryZones:
																		form.deliveryZones.filter(
																			(
																				z
																			) =>
																				z !==
																				zone
																		),
																})
															}
															className='shrink-0 text-muted-foreground hover:text-foreground'
															aria-label={`Remover ${zone}`}
														>
															<X className='size-3' />
														</button>
													}
												/>
												<TooltipContent>
													Remover {zone}
												</TooltipContent>
											</Tooltip>
										</li>
									))}
								</ul>
							) : (
								<p className='text-xs text-muted-foreground'>
									Adicione bairros ou zonas onde entrega.
								</p>
							)}
						</div>
					</div>
				) : null}
			</div>
		</StoreSection>
	)
}
