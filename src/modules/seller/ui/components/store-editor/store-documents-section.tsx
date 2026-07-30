'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FileCheck2, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { SellerStoreDocument } from '@/lib/types/api/seller'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'
import { DOC_STATUS_LABELS, DOC_STATUS_STYLES } from './constants'
import { StoreSection } from './store-section'

type StoreDocumentsSectionProps = {
	documents: SellerStoreDocument[]
	verifiedAt: string | null
}

function docLabel(doc: SellerStoreDocument) {
	if (doc.kind === 'selfie_with_document') return 'Selfie com documento'
	if (doc.type === 'ID_CARD') return 'Documento de identidade'
	return doc.type
}

export function StoreDocumentsSection({
	documents,
	verifiedAt,
}: StoreDocumentsSectionProps) {
	const queryClient = useQueryClient()
	const [resubmitting, setResubmitting] = useState(false)
	const [idCardUrl, setIdCardUrl] = useState<string | null>(null)
	const [selfieUrl, setSelfieUrl] = useState<string | null>(null)

	const hasRejected = documents.some((d) => d.status === 'REJECTED')
	const allApproved =
		documents.length > 0 && documents.every((d) => d.status === 'APPROVED')
	const canResubmit = !allApproved || hasRejected

	const mutation = useMutation({
		mutationFn: async () => {
			if (!idCardUrl || !selfieUrl) {
				throw new Error('Carregue ambos os documentos')
			}
			const res = await fetch('/api/seller/store/documents', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idCardUrl, selfieUrl }),
			})
			const json = await res.json()
			if (!res.ok) throw new Error(json.error ?? 'Falha ao reenviar')
			return json
		},
		onSuccess: () => {
			toast.success('Documentos reenviados para análise')
			setResubmitting(false)
			setIdCardUrl(null)
			setSelfieUrl(null)
			queryClient.invalidateQueries({ queryKey: ['seller-store'] })
		},
		onError: (error: Error) => toast.error(error.message),
	})

	return (
		<StoreSection
			title='Documentos'
			description='Estado da verificação da loja.'
			action={
				verifiedAt ? (
					<span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700'>
						<FileCheck2 className='size-3.5' />
						Verificada
					</span>
				) : null
			}
		>
			{documents.length === 0 ? (
				<p className='text-sm text-muted-foreground'>
					Ainda não há documentos submetidos. Complete a verificação
					no onboarding ou reenvie abaixo.
				</p>
			) : (
				<ul className='space-y-2'>
					{documents.map((doc) => (
						<li
							key={doc.id}
							className='flex items-center justify-between gap-3 rounded-lg border border-border/50 px-3 py-2.5'
						>
							<div className='min-w-0'>
								<p className='truncate text-sm font-medium'>
									{docLabel(doc)}
								</p>
								{doc.rejectionReason ? (
									<p className='mt-0.5 text-xs text-destructive'>
										{doc.rejectionReason}
									</p>
								) : null}
							</div>
							<span
								className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${DOC_STATUS_STYLES[doc.status] ?? 'bg-muted text-muted-foreground'}`}
							>
								{DOC_STATUS_LABELS[doc.status] ?? doc.status}
							</span>
						</li>
					))}
				</ul>
			)}

			{canResubmit ? (
				<div className='mt-4 space-y-4 border-t border-border/50 pt-4'>
					{!resubmitting ? (
						<Button
							type='button'
							variant='outline'
							size='sm'
							className='rounded-full'
							onClick={() => setResubmitting(true)}
						>
							<RotateCcw className='size-3.5' />
							Reenviar documentos
						</Button>
					) : (
						<>
							<div className='grid gap-4 sm:grid-cols-2'>
								<FileUploadCard
									label='Documento de identidade'
									hint='BI / Passaporte'
									variant='document'
									purpose='verification-id'
									value={idCardUrl}
									onChange={(url) => setIdCardUrl(url)}
								/>
								<FileUploadCard
									label='Selfie com documento'
									hint='Selfie com documento'
									variant='selfie'
									purpose='verification-selfie'
									value={selfieUrl}
									onChange={(url) => setSelfieUrl(url)}
								/>
							</div>
							<div className='flex flex-wrap gap-2'>
								<Button
									type='button'
									size='sm'
									className='rounded-full'
									disabled={
										mutation.isPending ||
										!idCardUrl ||
										!selfieUrl
									}
									onClick={() => mutation.mutate()}
								>
									{mutation.isPending
										? 'A enviar...'
										: 'Submeter para análise'}
								</Button>
								<Button
									type='button'
									variant='ghost'
									size='sm'
									onClick={() => {
										setResubmitting(false)
										setIdCardUrl(null)
										setSelfieUrl(null)
									}}
								>
									Cancelar
								</Button>
							</div>
						</>
					)}
				</div>
			) : null}
		</StoreSection>
	)
}
