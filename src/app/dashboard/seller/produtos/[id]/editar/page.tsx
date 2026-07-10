import { SellerEditProductView } from '@/modules/seller/ui/views/seller-edit-product-view'

export default async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	return <SellerEditProductView id={id} />
}
