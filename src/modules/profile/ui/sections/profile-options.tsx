'use client'

import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type ProfileOption = {
	title: string
	icon: LucideIcon
	url: string
}

type ProfileOptionsProps = {
	options: readonly ProfileOption[]
}

export function ProfileOptions({ options }: ProfileOptionsProps) {
	const router = useRouter()

	return (
		<div className='flex flex-col w-full min-w-0 border rounded-xl'>
			{options.map((opt) => {
				const Icon = opt.icon

				return (
					<Button
						variant='ghost'
						key={opt.title}
						className='flex justify-between py-4 px-3 h-12 border-b-black/20 last:border-b-0'
						onClick={() => router.push(`${opt.url}`)}
						render={
							<div className='rounded-none first:rounded-t-xl rounded-b-none last:rounded-b-xl'>
								<div className='flex items-center justify-center'>
									<Icon className='size-5 mr-2' />
									{opt.title}
								</div>
								<ChevronRight className='size-5 text-muted-foreground' />
							</div>
						}
					/>
				)
			})}
		</div>
	)
}
