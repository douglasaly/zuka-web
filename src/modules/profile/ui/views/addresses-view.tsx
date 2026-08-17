'use client'
import { useAddresses } from '../../hooks/use-addresses'
import { AddressesEmpty } from '../sections/addresses-empty'
import { AddressesFormDialog } from '../sections/addresses-form-dialog'
import { AddressesList } from '../sections/addresses-list'
import { AddressesLoading } from '../sections/addresses-loading'
import { AddressesToolbar } from '../sections/addresses-toolbar'
export const AddressesView = () => {
	const {
		addresses,
		loading,
		saving,
		deleting,
		dialogOpen,
		setDialogOpen,
		provinces,
		form,
		setForm,
		handleSave,
		handleDelete,
		handleSetDefault,
	} = useAddresses()
	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<AddressesToolbar onAdd={() => setDialogOpen(true)} />

			{loading ? (
				<AddressesLoading />
			) : addresses.length === 0 ? (
				<AddressesEmpty onAdd={() => setDialogOpen(true)} />
			) : (
				<AddressesList
					addresses={addresses}
					deleting={deleting}
					onSetDefault={handleSetDefault}
					onDelete={handleDelete}
				/>
			)}

			<AddressesFormDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				form={form}
				setForm={setForm}
				provinces={provinces}
				saving={saving}
				onSave={handleSave}
			/>
		</div>
	)
}
