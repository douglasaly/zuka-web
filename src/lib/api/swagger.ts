import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
	const spec = createSwaggerSpec({
		apiFolder: 'app/api',
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'ZUKA API docs',
				version: '1.0',
			},
			components: {
				securitySchemes: {
					CookieAuth: {
						type: 'apiKey',
						in: 'cookie',
						name: 'zuka_session',
					},
				},
			},
			security: [
				{
					CookieAuth: [],
				},
			],
		},
	})
	return spec
}
