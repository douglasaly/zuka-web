import 'swagger-ui-react/swagger-ui.css'
import { getApiDocs } from '@/lib/api/swagger'
import { noIndexMetadata } from '@/lib/seo/metadata'
import ReactSwagger from './react-swagger'

export const metadata = {
	...noIndexMetadata,
	title: 'API',
}

export default async function IndexPage() {
	const spec = await getApiDocs()
	return (
		<section className='container'>
			<ReactSwagger spec={spec} />
		</section>
	)
}
