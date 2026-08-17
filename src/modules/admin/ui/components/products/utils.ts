import type { AdminProduct } from '@/modules/admin/ui/components/products/constants'
export function getThumb(product: AdminProduct): string | undefined {
	const imgs = product.product_images as
		| Array<{
				url?: string
				is_primary?: boolean
		  }>
		| undefined
	return imgs?.find((i) => i.is_primary)?.url ?? imgs?.[0]?.url ?? undefined
}
export function productStatus(product: AdminProduct): string {
	return (
		(product.status as string) ||
		(product.is_visible ? 'ACTIVE' : 'INACTIVE')
	)
}
