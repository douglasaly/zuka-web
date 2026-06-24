import { UserDetailView } from '@/modules/admin/ui/views/user-detail-view'

type Props = { params: Promise<{ id: string }> }

export default async function UserDetailPage({ params }: Props) {
	const { id } = await params
	return <UserDetailView id={id} />
}
