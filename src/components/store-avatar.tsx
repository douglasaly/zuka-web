import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage } from './ui/avatar'

const avatarVariants = cva('', {
	variants: {
		size: {
			default: 'h-9 w-9',
			xs: 'h-4 w-4',
			sm: 'h-6 w-6',
			lg: 'h-10 w-10',
			xl: 'h-16 w-16',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
	imageUrl: string
	name: string
	className?: string
	onClick?: () => void
}

export const StoreAvatar = ({
	imageUrl,
	name,
	className,
	onClick,
	size,
}: UserAvatarProps) => {
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
			<AvatarImage src={imageUrl} alt={name} />
		</Avatar>
	)
}
