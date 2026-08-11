import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import Link from 'next/link'
import { StatusBadge } from '../components/status-badge'
import { StoreDetailInfoCard } from '../components/stores/store-detail-info-card'
import { UserDetailRow } from '../components/users/user-detail-row'

type UserDetailCardsProps = {
	user: Record<string, unknown>
	store?: Record<string, unknown>
	roles: string[]
}

export function UserDetailCards({ user, store, roles }: UserDetailCardsProps) {
	return (
		<>
			<StoreDetailInfoCard title='Perfil'>
				<UserDetailRow
					label='Nome'
					value={`${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()}
				/>
				<UserDetailRow label='Email' value={user.email as string} />
				<UserDetailRow
					label='Telefone'
					value={user.phone_number as string}
				/>
				<UserDetailRow label='Estado' value={undefined}>
					<StatusBadge status={(user.status as string) ?? 'ACTIVE'} />
				</UserDetailRow>
				<UserDetailRow label='Funções' value={undefined}>
					<div className='flex flex-wrap gap-1'>
						{roles.length > 0 ? (
							roles.map((r) => <StatusBadge key={r} status={r} />)
						) : (
							<StatusBadge status='buyer' />
						)}
					</div>
				</UserDetailRow>
				<UserDetailRow
					label='Criado em'
					value={
						user.created_at
							? format(
									new Date(user.created_at as string),
									'd MMM yyyy',
									{ locale: pt }
								)
							: '—'
					}
				/>
			</StoreDetailInfoCard>

			{store ? (
				<StoreDetailInfoCard title='Loja'>
					<UserDetailRow label='Nome' value={undefined}>
						<Link
							href={`/admin/stores/${store.id as string}`}
							className='text-sm font-medium text-primary hover:underline'
						>
							{store.name as string}
						</Link>
					</UserDetailRow>
					<UserDetailRow label='Estado' value={undefined}>
						<StatusBadge status={store.status as string} />
					</UserDetailRow>
				</StoreDetailInfoCard>
			) : null}
		</>
	)
}
