export function SignupErrorAlert({ error }: { error: string | null }) {
	if (!error) return null

	return (
		<p
			role='alert'
			className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'
		>
			{error}
		</p>
	)
}
