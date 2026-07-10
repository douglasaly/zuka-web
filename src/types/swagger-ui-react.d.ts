declare module 'swagger-ui-react' {
	import type { ComponentType } from 'react'

	interface SwaggerUIProps {
		spec?: Record<string, any>
		url?: string
		[key: string]: any
	}

	const SwaggerUI: ComponentType<SwaggerUIProps>
	export default SwaggerUI
}
