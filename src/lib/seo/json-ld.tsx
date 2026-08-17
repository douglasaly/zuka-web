export function JsonLd({ data }: { data: unknown }) {
	const json = JSON.stringify(data).replace(/</g, '\\u003c')
	return (
		<script
			type='application/ld+json'
			// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw JSON
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	)
}
