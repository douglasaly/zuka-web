import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

interface Props {
	error: string | null
}
export function ResetPasswordInvalidSection({ error }: Props) {
	return (
		<div className='flex min-h-screen items-center justify-center bg-muted/25 px-4 py-12'>
			<div className='w-full max-w-md space-y-6'>
				<div className='text-center'>
					<Link href='/' className='inline-flex items-center gap-2.5'>
						<div className='flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-extrabold text-primary-foreground'>
							Z
						</div>
						<span className='font-heading text-2xl font-bold tracking-tight'>
							Zuka
						</span>
					</Link>
				</div>

				<Card className='border-border/60'>
					<CardHeader className='space-y-1'>
						<CardTitle className='font-heading text-xl'>
							Link inválido
						</CardTitle>
						<CardDescription>{error}</CardDescription>
					</CardHeader>

					<CardContent className='space-y-3'>
						<Button
							render={
								<Link href='/auth/recuperar'>
									Solicitar novo link
								</Link>
							}
							className='w-full rounded-full'
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
