import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Image as ImageIcon } from 'lucide-react'

function Section({
	title,
	children,
}: {
	title: string
	children: React.ReactNode
}) {
	return (
		<div className='space-y-2'>
			<p className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
				{title}
			</p>
			<div className='rounded-xl border border-border/60 bg-muted/20 divide-y divide-border/40'>
				{children}
			</div>
		</div>
	)
}
function Row({ label, value }: { label: string; value?: string | null }) {
	if (!value) return null
	return (
		<div className='flex items-start gap-3 px-3 py-2.5'>
			<span className='w-24 shrink-0 text-xs text-muted-foreground'>
				{label}
			</span>
			<span className='min-w-0 break-words text-xs font-medium'>
				{value}
			</span>
		</div>
	)
}
type StoreReviewDetailProps = {
	store: Record<string, unknown>
	owner: Record<string, unknown> | undefined
	docs: Record<string, unknown>[]
}
export function StoreReviewDetail({
	store,
	owner,
	docs,
}: StoreReviewDetailProps) {
	return (
		<>
			<Section title='Informações da loja'>
				<Row label='Nome' value={store?.name as string} />
				<Row label='Descrição' value={store?.description as string} />
				<Row
					label='Categoria'
					value={
						(store?.categories as Record<string, unknown>)
							?.name as string
					}
				/>
				<Row
					label='Localização'
					value={`${((store?.provinces as Record<string, unknown>)?.name as string) ?? ''} · ${(store?.state as string) ?? ''}`}
				/>
				<Row label='Email' value={store?.email as string} />
				<Row label='Telefone' value={store?.phone as string} />
				<Row label='WhatsApp' value={store?.whatsapp as string} />
			</Section>

			{(Boolean(store?.logo_url) || Boolean(store?.banner_url)) && (
				<Section title='Imagens'>
					<div className='grid grid-cols-2 gap-3'>
						{Boolean(store?.logo_url) && (
							<img
								src={store?.logo_url as string}
								alt='Logo'
								className='aspect-square w-full rounded-xl object-cover border border-border'
							/>
						)}
						{Boolean(store?.banner_url) && (
							<img
								src={store?.banner_url as string}
								alt='Banner'
								className='aspect-video w-full rounded-xl object-cover border border-border col-span-2'
							/>
						)}
					</div>
				</Section>
			)}

			<Section title='Proprietário'>
				<Row
					label='Nome'
					value={`${(owner?.first_name as string) ?? ''} ${(owner?.last_name as string) ?? ''}`}
				/>
				<Row label='Email' value={owner?.email as string} />
				<Row label='Telefone' value={owner?.phone_number as string} />
				<Row
					label='Conta criada'
					value={
						owner?.created_at
							? format(
									new Date(owner.created_at as string),
									'd MMM yyyy',
									{ locale: pt }
								)
							: '—'
					}
				/>
			</Section>

			{docs.length > 0 && (
				<Section title='Documentos de verificação'>
					<div className='grid grid-cols-2 gap-3'>
						{docs.map((doc) => (
							<a
								key={doc.id as string}
								href={doc.file_url as string}
								target='_blank'
								rel='noreferrer'
								className='group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted'
							>
								{doc.file_url ? (
									<img
										src={doc.file_url as string}
										alt={doc.type as string}
										className='h-full w-full object-cover'
									/>
								) : (
									<div className='flex h-full items-center justify-center'>
										<ImageIcon className='size-8 text-muted-foreground' />
									</div>
								)}
								<div className='absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1'>
									<p className='text-xs text-white'>
										{doc.type as string}
									</p>
								</div>
							</a>
						))}
					</div>
				</Section>
			)}
		</>
	)
}
