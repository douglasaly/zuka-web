import { SearchX } from 'lucide-react'

type SearchEmptyProps = {
	query: string
}

export function SearchEmpty({ query }: SearchEmptyProps) {
	return (
		<div className='flex flex-col items-center justify-center gap-3 py-20'>
			<div className='flex size-16 items-center justify-center rounded-full bg-muted'>
				<SearchX className='size-7 text-muted-foreground/60' />
			</div>
			<h2 className='text-lg font-semibold'>Nenhum resultado</h2>
			<p className='max-w-xs text-center text-sm text-muted-foreground'>
				Nada encontrado para{' '}
				<span className='font-medium text-foreground'>"{query}"</span>.
				Tenta usar termos diferentes ou menos específicos.
			</p>
		</div>
	)
}
