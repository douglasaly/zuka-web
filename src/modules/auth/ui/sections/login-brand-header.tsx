import Link from 'next/link'

export function LoginBrandHeader() {
	return (
		<div className='text-center'>
			<Link href='/' className='inline-flex items-center gap-2.5'>
				<div className='flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground'>
					Z
				</div>
				<span className='font-heading text-2xl font-bold tracking-tight'>
					Zuka
				</span>
			</Link>
			<p className='mt-2 text-sm text-muted-foreground'>
				Bem-vindo de volta ao marketplace
			</p>
		</div>
	)
}
