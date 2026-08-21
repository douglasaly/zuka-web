'use client'
import type { Address } from '@/types'
import { AddressCard } from '../components/addresses/address-card'

type AddressesListProps = {
	addresses: Address[]
	deleting: string | null
	onSetDefault: (id: string) => void
	onDelete: (id: string) => void
}
export function AddressesList({
	addresses,
	deleting,
	onSetDefault,
	onDelete,
}: AddressesListProps) {
	return (
		<div className='space-y-3'>
			{addresses.map((address) => (
				<AddressCard
					key={address.id}
					address={address}
					deleting={deleting === address.id}
					onSetDefault={onSetDefault}
					onDelete={onDelete}
				/>
			))}
		</div>
	)
}
