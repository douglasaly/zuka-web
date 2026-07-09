import { SellerConversationView } from '@/modules/seller/ui/views/seller-conversation-view'

export default async function SellerConversationPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params
	return <SellerConversationView id={id} />
}
