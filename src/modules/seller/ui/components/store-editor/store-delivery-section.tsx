'use client'
import { Check, MapPinned, Plus, X } from 'lucide-react'
import { IconTooltipButton } from '@/components/icon-tooltip-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { DELIVERY_ZONE_PRESETS, NATIONWIDE_ZONE_LABEL } from './constants'
import { StoreSection } from './store-section'
import type { StoreFormState } from './types'

type StoreDeliverySectionProps = {
	form: StoreFormState
	onChange: (patch: Partial<StoreFormState>) => void
}
function zoneSelected(zones: string[], label: string) {
	return zones.some((z) => z.toLowerCase() === label.toLowerCase())
}
export function StoreDeliverySection({
	form,
	onChange,
}: StoreDeliverySectionProps) {
	const hasNationwide = zoneSelected(
		form.deliveryZones,
		NATIONWIDE_ZONE_LABEL
	)
	const customZones = form.deliveryZones.filter(
		(z) =>
			!DELIVERY_ZONE_PRESETS.some(
				(p) => p.label.toLowerCase() === z.toLowerCase()
			)
	)
	function setZones(next: string[]) {
		onChange({ deliveryZones: next })
	}
	function togglePreset(label: string, exclusive: boolean) {
		const selected = zoneSelected(form.deliveryZones, label)
		if (selected) {
			setZones(
				form.deliveryZones.filter(
					(z) => z.toLowerCase() !== label.toLowerCase()
				)
			)
			return
		}
		if (exclusive) {
			setZones([label])
			return
		}
		const withoutNationwide = form.deliveryZones.filter(
			(z) => z.toLowerCase() !== NATIONWIDE_ZONE_LABEL.toLowerCase()
		)
		setZones([...withoutNationwide, label])
	}
	function addCustomZone() {
		const zone = form.zoneDraft.trim()
		if (!zone) return
		if (zoneSelected(form.deliveryZones, zone)) {
			onChange({ zoneDraft: '' })
			return
		}
		const withoutNationwide = form.deliveryZones.filter(
			(z) => z.toLowerCase() !== NATIONWIDE_ZONE_LABEL.toLowerCase()
		)
		onChange({
			deliveryZones: [...withoutNationwide, zone],
			zoneDraft: '',
		})
	}
	function removeZone(zone: string) {
		setZones(form.deliveryZones.filter((z) => z !== zone))
	}
	return (
		<StoreSection
			title='Entrega'
			description='Define se entregas e em que zonas.'
		>
			<div className='min-w-0 space-y-5'>
				<div className='flex min-w-0 items-center justify-between gap-4 rounded-xl border border-border/50 bg-muted/30 px-4 py-3'>
					<div className='min-w-0'>
						<p className='text-sm font-medium'>Faz entregas?</p>
						<p className='text-xs leading-relaxed text-muted-foreground'>
							Active para indicar as zonas onde entregas.
						</p>
					</div>
					<Switch
						checked={form.hasDelivery}
						onCheckedChange={(hasDelivery) =>
							onChange({ hasDelivery })
						}
						aria-label='Faz entregas'
					/>
				</div>

				{form.hasDelivery ? (
					<div className='min-w-0 animate-in fade-in-0 slide-in-from-top-1 space-y-3 duration-200'>
						<div className='space-y-1'>
							<Label id='delivery-zones-label'>
								Zonas de entrega
							</Label>
							<p
								id='delivery-zones-hint'
								className='text-xs leading-relaxed text-muted-foreground'
							>
								Escolhe sugestões ou adiciona a tua zona. “Todo
								o país” substitui zonas locais.
							</p>
						</div>

						<fieldset className='min-w-0 space-y-3 border-0 p-0'>
							<legend className='sr-only'>
								Sugestões de zonas de entrega
							</legend>
							<div className='flex flex-wrap gap-2'>
								{DELIVERY_ZONE_PRESETS.map((preset) => {
									const selected = zoneSelected(
										form.deliveryZones,
										preset.label
									)
									return (
										<button
											key={preset.id}
											type='button'
											aria-pressed={selected}
											onClick={() =>
												togglePreset(
													preset.label,
													preset.exclusive
												)
											}
											className={cn(
												'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-150',
												'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
												selected
													? preset.exclusive
														? 'border-secondary/40 bg-secondary/10 text-secondary shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
														: 'border-foreground/20 bg-foreground/5 text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
													: 'border-border/70 bg-background text-muted-foreground hover:border-foreground/20 hover:bg-muted/50 hover:text-foreground'
											)}
										>
											{selected ? (
												<Check
													className='size-3.5 shrink-0'
													strokeWidth={2.5}
													aria-hidden
												/>
											) : preset.exclusive ? (
												<MapPinned
													className='size-3.5 shrink-0 opacity-70'
													aria-hidden
												/>
											) : null}
											{preset.label}
										</button>
									)
								})}
							</div>
						</fieldset>

						<div className='flex min-w-0 gap-2'>
							<Input
								id='delivery-zone-custom'
								value={form.zoneDraft}
								onChange={(e) =>
									onChange({ zoneDraft: e.target.value })
								}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault()
										addCustomZone()
									}
								}}
								placeholder='Outra zona - ex: Costa do Sol'
								disabled={hasNationwide}
								aria-label='Adicionar zona personalizada'
								className='h-11 min-w-0'
							/>
							<IconTooltipButton
								label='Adicionar zona'
								variant='outline'
								size='icon'
								className='size-11 shrink-0'
								onClick={addCustomZone}
								disabled={
									hasNationwide || !form.zoneDraft.trim()
								}
							>
								<Plus className='size-4' />
							</IconTooltipButton>
						</div>

						{hasNationwide ? (
							<p className='text-xs leading-relaxed text-muted-foreground'>
								As entregas são disponíveis em todo o país.
							</p>
						) : null}

						{!hasNationwide && customZones.length > 0 ? (
							<ul className='flex flex-wrap gap-2'>
								{customZones.map((zone) => (
									<li
										key={zone}
										className='inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 py-1.5 pl-3 pr-1.5 text-xs font-medium'
									>
										<span className='truncate'>{zone}</span>
										<Tooltip>
											<TooltipTrigger
												render={
													<button
														type='button'
														onClick={() =>
															removeZone(zone)
														}
														className='flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
														aria-label={`Remover ${zone}`}
													>
														<X className='size-3.5' />
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
						) : null}

						{form.deliveryZones.length === 0 ? (
							<p className='rounded-xl border border-dashed border-border/70 bg-muted/20 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground'>
								Ainda sem zonas. Os clientes usam esta info para
								saber se entregas na área deles.
							</p>
						) : null}
					</div>
				) : null}
			</div>
		</StoreSection>
	)
}
