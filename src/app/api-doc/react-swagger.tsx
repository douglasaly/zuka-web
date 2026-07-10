'use client'

import { useEffect, useState } from 'react'

type Props = {
	spec: Record<string, any>
}

function ReactSwagger({ spec }: Props) {
	const [SwaggerUI, setSwaggerUI] = useState<any>(null)

	useEffect(() => {
		import('swagger-ui-react')
			.then((mod) => setSwaggerUI(() => mod.default))
			.catch(() => setSwaggerUI(null))
	}, [])

	if (!SwaggerUI) {
		return (
			<div className='p-8 text-center text-muted-foreground'>
				A carregar documentação...
			</div>
		)
	}

	return <SwaggerUI spec={spec} />
}

export default ReactSwagger
