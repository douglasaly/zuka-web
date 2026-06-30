import { MessageView } from '@/modules/messages/ui/views/message-view'

interface MessagePageProps {
	params: Promise<{ id: string }>
}

const Page = async ({ params }: MessagePageProps) => {
	const { id } = await params
	return <MessageView messageId={id} />
}

export default Page
