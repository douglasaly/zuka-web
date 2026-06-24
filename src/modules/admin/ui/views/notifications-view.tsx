'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Send } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const TARGETS = [
	{ value: 'all', label: 'Todos os utilizadores' },
	{ value: 'buyers', label: 'Apenas compradores' },
	{ value: 'sellers', label: 'Apenas vendedores' },
]

type Notification = {
	id: string
	target: string
	title: string
	body: string
	sentAt: string
}

export function NotificationsView() {
	const qc = useQueryClient()
	const [target, setTarget] = useState('all')
	const [title, setTitle] = useState('')
	const [body, setBody] = useState('')

	const { data } = useQuery({
		queryKey: ['admin-notifications'],
		queryFn: async () => {
			const res = await fetch('/api/admin/notifications', { credentials: 'include' })
			return res.json()
		},
	})

	const sendMutation = useMutation({
		mutationFn: async () => {
			const res = await fetch('/api/admin/notifications', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ target, title, body }),
			})
			if (!res.ok) throw new Error('Failed')
			return res.json()
		},
		onSuccess: (data) => {
			toast.success('Notificação enviada com sucesso')
			const prev = qc.getQueryData<{ notifications: Notification[] }>(['admin-notifications'])
			qc.setQueryData(['admin-notifications'], {
				notifications: [data.notification, ...(prev?.notifications ?? [])],
			})
			setTitle('')
			setBody('')
		},
		onError: () => toast.error('Falhou ao enviar notificação'),
	})

	const notifications: Notification[] = data?.notifications ?? []

	const targetLabel = (t: string) => TARGETS.find((x) => x.value === t)?.label ?? t

	return (
		<div className='grid gap-6 xl:grid-cols-[1fr_1.5fr]'>
			{/* Compose */}
			<div className='space-y-4'>
				<div className='rounded-2xl border border-border/60 bg-card p-5 space-y-4'>
					<p className='font-heading text-sm font-bold'>Compor notificação</p>

					<div className='space-y-2'>
						<Label className='text-xs font-medium'>Destinatário</Label>
						<div className='flex flex-col gap-1'>
							{TARGETS.map((t) => (
								<label key={t.value} className='flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5'>
									<input
										type='radio'
										name='target'
										value={t.value}
										checked={target === t.value}
										onChange={() => setTarget(t.value)}
										className='accent-primary'
									/>
									{t.label}
								</label>
							))}
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='notif-title' className='text-xs font-medium'>Título</Label>
						<Input
							id='notif-title'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Título da notificação'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='notif-body' className='text-xs font-medium'>Mensagem</Label>
						<Textarea
							id='notif-body'
							value={body}
							onChange={(e) => setBody(e.target.value)}
							placeholder='Corpo da notificação...'
							className='min-h-28 resize-none'
						/>
					</div>

					<Button
						type='button'
						disabled={!title.trim() || !body.trim() || sendMutation.isPending}
						onClick={() => sendMutation.mutate()}
						className='w-full'
					>
						<Send className='size-4' />
						{sendMutation.isPending ? 'A enviar...' : 'Enviar notificação'}
					</Button>
				</div>
			</div>

			{/* Log */}
			<div className='rounded-2xl border border-border/60 bg-card overflow-hidden'>
				<p className='border-b border-border/60 px-5 py-4 font-heading text-sm font-bold'>Notificações enviadas</p>
				{notifications.length === 0 ? (
					<div className='py-12 text-center text-sm text-muted-foreground'>
						Nenhuma notificação enviada ainda.
					</div>
				) : (
					<div className='divide-y divide-border/40'>
						{notifications.map((n) => (
							<div key={n.id} className='px-5 py-4 space-y-1'>
								<div className='flex items-start justify-between gap-2'>
									<div className='min-w-0'>
										<p className='font-medium text-sm truncate'>{n.title}</p>
										<p className='text-xs text-muted-foreground'>{n.body}</p>
									</div>
									<span className='shrink-0 rounded-full border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground'>
										{targetLabel(n.target)}
									</span>
								</div>
								<p className='text-xs text-muted-foreground'>
									{n.sentAt ? format(new Date(n.sentAt), "d MMM yyyy 'às' HH:mm", { locale: pt }) : '—'}
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
