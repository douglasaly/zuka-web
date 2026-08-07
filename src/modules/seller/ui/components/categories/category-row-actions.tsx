import type { ReactNode } from 'react'

export function CategoryRowActions({ children }: { children: ReactNode }) {
	return (
		<div className='flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
			{children}
		</div>
	)
}
