import Link from 'next/link'
import { Button } from '@/components/ui/button'
export function ProfileUnauth() {
	return (
		<div className='mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center'>
			<p className='text-muted-foreground'>
				Entre na sua conta para ver o perfil.
			</p>
			<Button
				render={<Link href='/auth/login?next=/perfil'>Entrar</Link>}
			/>
		</div>
	)
}
