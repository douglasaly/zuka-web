'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

type StoreLogoCropDialogProps = {
	open: boolean
	file: File | null
	onOpenChange: (open: boolean) => void
	onCropped: (blob: Blob) => void
}

const OUTPUT_SIZE = 512

export function StoreLogoCropDialog({
	open,
	file,
	onOpenChange,
	onCropped,
}: StoreLogoCropDialogProps) {
	const imgRef = useRef<HTMLImageElement>(null)
	const [objectUrl, setObjectUrl] = useState<string | null>(null)
	const [scale, setScale] = useState(1)
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const dragRef = useRef<{ x: number; y: number } | null>(null)

	useEffect(() => {
		if (!file) {
			setObjectUrl(null)
			return
		}
		const url = URL.createObjectURL(file)
		setObjectUrl(url)
		setScale(1)
		setOffset({ x: 0, y: 0 })
		return () => URL.revokeObjectURL(url)
	}, [file])

	function handlePointerDown(e: React.PointerEvent) {
		dragRef.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
		;(e.target as HTMLElement).setPointerCapture(e.pointerId)
	}

	function handlePointerMove(e: React.PointerEvent) {
		if (!dragRef.current) return
		setOffset({
			x: e.clientX - dragRef.current.x,
			y: e.clientY - dragRef.current.y,
		})
	}

	function handlePointerUp() {
		dragRef.current = null
	}

	function confirmCrop() {
		const img = imgRef.current
		if (!img || !img.naturalWidth) return

		const canvas = document.createElement('canvas')
		canvas.width = OUTPUT_SIZE
		canvas.height = OUTPUT_SIZE
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const view = 280
		const base = Math.max(view / img.naturalWidth, view / img.naturalHeight)
		const drawW = img.naturalWidth * base * scale
		const drawH = img.naturalHeight * base * scale
		const dx = (view - drawW) / 2 + offset.x
		const dy = (view - drawH) / 2 + offset.y

		const scaleToOutput = OUTPUT_SIZE / view
		ctx.fillStyle = '#fff'
		ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
		ctx.drawImage(
			img,
			dx * scaleToOutput,
			dy * scaleToOutput,
			drawW * scaleToOutput,
			drawH * scaleToOutput
		)

		canvas.toBlob(
			(blob) => {
				if (blob) onCropped(blob)
			},
			'image/jpeg',
			0.92
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle>Ajustar logo</DialogTitle>
					<DialogDescription>
						Arraste e ajuste o zoom para enquadrar o logo num
						quadrado.
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4'>
					<div
						className='relative mx-auto size-[280px] cursor-grab overflow-hidden rounded-2xl bg-muted active:cursor-grabbing'
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
					>
						{objectUrl ? (
							// biome-ignore lint/performance/noImgElement: local blob URL for crop preview
							<img
								ref={imgRef}
								src={objectUrl}
								alt='Pré-visualização do logo'
								draggable={false}
								className='pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none'
								style={{
									transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${scale})`,
									transformOrigin: 'center center',
								}}
							/>
						) : null}
						<div className='pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-foreground/20' />
					</div>

					<label className='block space-y-2'>
						<span className='text-xs font-medium text-muted-foreground'>
							Zoom
						</span>
						<input
							type='range'
							min={1}
							max={3}
							step={0.05}
							value={scale}
							onChange={(e) => setScale(Number(e.target.value))}
							className='w-full accent-primary'
						/>
					</label>
				</div>

				<DialogFooter>
					<Button
						type='button'
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Cancelar
					</Button>
					<Button type='button' onClick={confirmCrop}>
						Aplicar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
