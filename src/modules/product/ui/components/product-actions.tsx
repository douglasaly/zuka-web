/** biome-ignore-all lint/a11y/useAnchorContent: <Allow use anchor a> */
import { MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ProductActionsProps = {
	whatsappHref: string
	phoneHref: string
	onChat: () => void
}

export const ProductActions = ({
	whatsappHref,
	phoneHref,
	onChat,
}: ProductActionsProps) => (
	<div className='flex gap-2'>
		<Button
			render={
				<a
					href={whatsappHref}
					target='_blank'
					rel='noopener noreferrer'
				/>
			}
			className='flex-1 rounded-xl bg-[#25D366] text-white hover:bg-[#20bd5a]'
			size='lg'
		>
			WhatsApp
		</Button>
		<Button
			render={<a href={phoneHref} />}
			variant='outline'
			size='lg'
			className='rounded-xl'
		>
			<Phone className='size-4' />
			Ligar
		</Button>
		<Button
			variant='outline'
			size='lg'
			className='rounded-xl'
			onClick={onChat}
		>
			<MessageCircle className='size-4' />
			Chat
		</Button>
	</div>
)
