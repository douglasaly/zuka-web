'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import {
	BarChart3,
	Bell,
	ChevronRight,
	LayoutDashboard,
	LogOut,
	Package,
	Settings,
	ShieldCheck,
	Store,
	Users,
	Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const nav = [
	{
		label: 'Overview',
		href: '/admin',
		icon: LayoutDashboard,
		exact: true,
	},
	{
		label: 'Lojas',
		icon: Store,
		children: [
			{ label: 'Pendentes', href: '/admin/stores/pending', icon: Clock },
			{ label: 'Todas as lojas', href: '/admin/stores', icon: Store },
		],
	},
	{ label: 'Utilizadores', href: '/admin/users', icon: Users },
	{ label: 'Produtos', href: '/admin/products', icon: Package },
	{ label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
	{ label: 'Notificações', href: '/admin/notifications', icon: Bell },
	{ label: 'Definições', href: '/admin/settings', icon: Settings },
]

function NavItem({
	item,
	collapsed,
}: {
	item: (typeof nav)[number]
	collapsed: boolean
}) {
	const pathname = usePathname()
	const [open, setOpen] = useState(false)

	if ('children' in item && item.children) {
		const isActive = item.children.some((c) => pathname.startsWith(c.href))
		return (
			<div>
				<button
					type='button'
					onClick={() => setOpen((v) => !v)}
					className={cn(
						'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
						isActive
							? 'bg-white/10 text-white'
							: 'text-white/60 hover:bg-white/5 hover:text-white'
					)}
				>
					<item.icon className='size-4 shrink-0' />
					{!collapsed && (
						<>
							<span className='flex-1 text-left'>{item.label}</span>
							<ChevronRight
								className={cn('size-3.5 transition-transform', (open || isActive) && 'rotate-90')}
							/>
						</>
					)}
				</button>
				{(open || isActive) && !collapsed && (
					<div className='ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3'>
						{item.children.map((child) => {
							const active = pathname === child.href || pathname.startsWith(child.href + '/')
							return (
								<Link
									key={child.href}
									href={child.href}
									className={cn(
										'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										active
											? 'border-l-2 border-[#5C4AE4] bg-[#5C4AE4]/10 text-white'
											: 'text-white/50 hover:text-white'
									)}
								>
									<child.icon className='size-3.5' />
									{child.label}
								</Link>
							)
						})}
					</div>
				)}
			</div>
		)
	}

	const active = 'exact' in item && item.exact
		? pathname === item.href
		: pathname === item.href || pathname.startsWith((item.href ?? '') + '/')

	return (
		<Link
			href={item.href ?? '#'}
			title={collapsed ? item.label : undefined}
			className={cn(
				'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
				active
					? 'border-l-2 border-[#5C4AE4] bg-[#5C4AE4]/10 text-white'
					: 'text-white/60 hover:bg-white/5 hover:text-white'
			)}
		>
			<item.icon className='size-4 shrink-0' />
			{!collapsed && item.label}
		</Link>
	)
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
	const [collapsed, setCollapsed] = useState(false)

	return (
		<div className='flex min-h-screen'>
			{/* Sidebar */}
			<aside
				className={cn(
					'flex flex-col border-r border-white/10 bg-[#0A0A0A] transition-all duration-200',
					collapsed ? 'w-14' : 'w-56'
				)}
			>
				<div className='flex items-center gap-2.5 border-b border-white/10 px-4 py-4'>
					<div className='flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-extrabold text-black'>
						Z
					</div>
					{!collapsed && (
						<div>
							<p className='text-sm font-bold text-white'>Zuka Admin</p>
							<p className='text-xs text-white/40'>Painel de controlo</p>
						</div>
					)}
				</div>

				<nav className='flex-1 space-y-0.5 overflow-y-auto p-2'>
					{nav.map((item) => (
						<NavItem key={item.label} item={item} collapsed={collapsed} />
					))}
				</nav>

				<div className='border-t border-white/10 p-2 space-y-1'>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						onClick={() => setCollapsed((v) => !v)}
						className='w-full justify-start text-white/50 hover:bg-white/5 hover:text-white'
					>
						<ChevronRight className={cn('size-4 transition-transform', !collapsed && 'rotate-180')} />
						{!collapsed && <span className='ml-1 text-xs'>Colapsar</span>}
					</Button>
					<Link
						href='/log-out'
						className={cn(
							'flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white',
							collapsed && 'justify-center px-0'
						)}
					>
						<LogOut className='size-4' />
						{!collapsed && 'Sair'}
					</Link>
				</div>
			</aside>

			{/* Main */}
			<div className='flex min-h-screen flex-1 flex-col bg-background'>
				<AdminTopBar />
				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}

function AdminTopBar() {
	const pathname = usePathname()
	const segments = pathname.replace('/admin', '').split('/').filter(Boolean)
	const breadcrumb = ['Admin', ...segments.map((s) => s.charAt(0).toUpperCase() + s.slice(1))]

	return (
		<header className='sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/95 px-6 py-3 backdrop-blur-sm'>
			<div>
				<p className='text-xs text-muted-foreground'>{breadcrumb.join(' / ')}</p>
				<p className='font-heading text-lg font-bold leading-tight'>
					{breadcrumb[breadcrumb.length - 1]}
				</p>
			</div>
			<div className='flex items-center gap-2'>
				<Link
					href='/'
					className='rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
				>
					← Voltar ao site
				</Link>
				<div className='flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground'>
					<ShieldCheck className='size-4' />
				</div>
			</div>
		</header>
	)
}
