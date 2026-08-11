import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Image as ImageIcon } from 'lucide-react'
import {
	StoreDetailInfoCard,
	StoreDetailInfoRow,
} from '../components/stores/store-detail-info-card'

type StoreDetailInfoProps = {
	store: Record<string, unknown>
	owner: Record<string, unknown> | undefined
	province: Record<string, unknown> | undefined
	docs: Record<string, unknown>[]
}

export function StoreDetailInfo({
	store,
	owner,
	province,
	docs,
}: StoreDetailInfoProps) {
	return (
		<div className='grid gap-6 md:grid-cols-2'>
			<div className='space-y-4'>
				<StoreDetailInfoCard title='Loja'>
					<StoreDetailInfoRow
						label='Nome'
						value={store.name as string}
					/>
					<StoreDetailInfoRow
						label='Descrição'
						value={store.description as string}
					/>
					<StoreDetailInfoRow
						label='Categoria'
						value={
							(store.categories as Record<string, unknown>)
								?.name as string
						}
					/>
					<StoreDetailInfoRow
						label='Província'
						value={province?.name as string}
					/>
					<StoreDetailInfoRow
						label='Estado'
						value={store.state as string}
					/>
					<StoreDetailInfoRow
						label='Email'
						value={store.email as string}
					/>
					<StoreDetailInfoRow
						label='Telefone'
						value={store.phone as string}
					/>
					<StoreDetailInfoRow
						label='WhatsApp'
						value={store.whatsapp as string}
					/>
					<StoreDetailInfoRow
						label='Criada'
						value={
							store.created_at
								? format(
										new Date(store.created_at as string),
										'd MMM yyyy',
										{ locale: pt }
									)
								: '—'
						}
					/>
					<StoreDetailInfoRow
						label='Seguidores'
						value={String(store.followerCount ?? 0)}
					/>
				</StoreDetailInfoCard>

				<StoreDetailInfoCard title='Proprietário'>
					<StoreDetailInfoRow
						label='Nome'
						value={`${owner?.first_name ?? ''} ${owner?.last_name ?? ''}`.trim()}
					/>
					<StoreDetailInfoRow
						label='Email'
						value={owner?.email as string}
					/>
					<StoreDetailInfoRow
						label='Telefone'
						value={owner?.phone_number as string}
					/>
					<StoreDetailInfoRow
						label='Conta'
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
				</StoreDetailInfoCard>
			</div>

			<div className='space-y-4'>
				{(Boolean(store.logo_url) || Boolean(store.banner_url)) && (
					<StoreDetailInfoCard title='Imagens'>
						<div className='p-3 space-y-2'>
							{Boolean(store.logo_url) && (
								<img
									src={store.logo_url as string}
									alt='Logo'
									className='h-24 w-full rounded-lg object-contain border border-border'
								/>
							)}
							{Boolean(store.banner_url) && (
								<img
									src={store.banner_url as string}
									alt='Banner'
									className='aspect-video w-full rounded-lg object-cover border border-border'
								/>
							)}
						</div>
					</StoreDetailInfoCard>
				)}

				{docs.length > 0 && (
					<StoreDetailInfoCard title='Documentos de verificação'>
						<div className='grid grid-cols-2 gap-2 p-3'>
							{docs.map((doc) => (
								<a
									key={doc.id as string}
									href={doc.file_url as string}
									target='_blank'
									rel='noreferrer'
									className='group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted'
								>
									{doc.file_url ? (
										<img
											src={doc.file_url as string}
											alt={doc.type as string}
											className='h-full w-full object-cover'
										/>
									) : (
										<div className='flex h-full items-center justify-center'>
											<ImageIcon className='size-6 text-muted-foreground' />
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
					</StoreDetailInfoCard>
				)}
			</div>
		</div>
	)
}
