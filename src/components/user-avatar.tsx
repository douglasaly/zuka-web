import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/get-initials'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const avatarVariants = cva('', {
	variants: {
		size: {
			default: 'h-9 w-9',
			xs: 'h-4 w-4',
			sm: 'h-6 w-6',
			lg: 'h-10 w-10',
			xl: 'h-[4.5rem] w-[4.5rem]',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
	imageUrl?: string | null
	name: string
	className?: string
	onClick?: () => void
}

export const UserAvatar = ({
	imageUrl,
	name,
	className,
	onClick,
	size,
}: UserAvatarProps) => {
	const nameFallback = getInitials(name)

	return (
		<Avatar
			className={cn(
				avatarVariants({
					size,
					className,
				})
			)}
			onClick={onClick}
		>
			{imageUrl && <AvatarImage src={imageUrl} alt={name} />}

			<AvatarFallback className='font-bold text-3xl'>
				{nameFallback}
			</AvatarFallback>
		</Avatar>
	)
}
