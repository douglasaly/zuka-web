import Link from 'next/link'
import { Separator } from './ui/separator'

export const AppFooter = () => {
	return (
		<footer className='border-t border-gray-200 px-4 py-2'>
			<div className='flex gap-4 py-4 px-2'>
				<div className='flex-1'>
					<h2 className='font-bold text-3xl tracking-tight'>Zuka</h2>
					<p>O seu marketplace, onde cada produto se transforma numa experiência web encantadora.</p>
				</div>

				<div className=' flex gap-4 justify-between'>
					<div>
						<h3 className='text-xl font-medium'>Explorar</h3>
						<ul className='text-sm underline flex flex-col space-y-0.5'>
							<Link href={'/'}>Início</Link>
							<Link href={'/'}>Produtos</Link>
							<Link href={'/'}>Contactos</Link>
						</ul>
					</div>
					<div>
						<h3 className='text-xl font-medium'>Resources</h3>
						<ul className='text-sm underline flex flex-col space-y-0.5'>
							<Link href={'/'}>Blog</Link>
							<Link href={'/'}>Carreiras</Link>
							<Link href={'/'}>Suporte</Link>
						</ul>
					</div>
				</div>
			</div>

			<Separator />
			<div className='w-full text-center p-4'>
				<span>
					©{new Date().getFullYear()}{' '}
					<span className='font-semibold'> Dotcom TechLabs</span>
				</span>
				<br />
				<span>Todos direitos reservados.</span>
			</div>
		</footer>
	)
}
