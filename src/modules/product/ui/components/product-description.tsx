'use client'

import { useState } from 'react'

type ProductDescriptionProps = {
	description?: string | null
}

const MAX_LENGTH = 220

export const ProductDescription = ({
	description,
}: ProductDescriptionProps) => {
	const [expanded, setExpanded] = useState(false)
	const text = description || 'Sem descrição disponível.'
	const isLong = text.length > MAX_LENGTH
	const displayText =
		isLong && !expanded ? `${text.slice(0, MAX_LENGTH)}...` : text

	return (
		<div className='space-y-2'>
			<h2 className='font-heading font-bold'>Descrição</h2>
			<p className='text-sm leading-relaxed text-muted-foreground'>
				{displayText}
			</p>
			{isLong && (
				<button
					type='button'
					onClick={() => setExpanded((prev) => !prev)}
					className='text-sm font-medium text-secondary hover:underline'
				>
					{expanded ? 'Ver menos' : 'Ver mais'}
				</button>
			)}
		</div>
	)
}
