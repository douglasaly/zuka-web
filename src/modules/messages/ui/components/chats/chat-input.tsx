'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type ChatInputProps = {
	onSend: (text: string) => void
}

export const ChatInput = ({ onSend }: ChatInputProps) => {
	const [value, setValue] = useState('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		const trimmed = value.trim()
		if (!trimmed) return

		onSend(trimmed)
		setValue('')
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='fixed bottom-0 left-0 right-0 z-50 border bg-white pb-6 pt-4 md:left-72 md:right-8'
		>
			<div className='flex gap-2 px-4'>
				<Input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					className='h-12 flex-1 bg-gray-200 placeholder:text-sm placeholder:text-muted-foreground'
					placeholder='Escreva uma mensagem...'
				/>
				<Button
					type='submit'
					className='h-12 w-12'
					disabled={!value.trim()}
				>
					<Send className='size-5' />
				</Button>
			</div>
		</form>
	)
}
