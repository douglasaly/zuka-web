import { Bell, Heart, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { SearchInput } from './search-input'

export const HomeNavbar = () => {
	return (
		<nav className='shadow bg-white flex flex-col gap-4 items-center px-2 pr-5 z-30'>
			<div className='w-full px-4'>
				<div className='flex items-center gap-4 w-full '>
					{/* Menu and logo */}
					<div className='flex items-center shrink-0'>
						{/* <SidebarTrigger /> */}
						<Link prefetch href='/' className=''>
							<div className='flex gap-2 py-4 items-center '>
								<p className='font-bold text-3xl tracking-tight hidden md:block'>
									Zuka
								</p>
							</div>
						</Link>
					</div>

					{/* Project Location */}
					<div className='flex-1 flex justify-center max-w-180 mx-auto items-center font-semibold'>
						<MapPin className='size-5 mr-1' />
						Maputo, MZ
					</div>

					{/* Activity */}
					<div className='flex justify-center items-center gap-4'>
						<Button
							variant='ghost'
							size='icon'
							className='size-5 cursor-pointer'
							type='button'
						>
							<Heart className='size-5 mr-2' />
						</Button>

						<Button
							variant='ghost'
							size='icon'
							className='size-5 cursor-pointer'
							type='button'
						>
							<Bell className='size-5 mr-2' />
						</Button>
					</div>
				</div>

				{/* Search Input */}
				<div className='flex-1 flex justify-center w-full mx-auto '>
					<Suspense fallback={<div className='w-full h-10' />}>
						<SearchInput />
					</Suspense>
				</div>
			</div>
		</nav>
	)
}
