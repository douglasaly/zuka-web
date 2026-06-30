type MessagesHeaderProps = {
	count?: number
}

export const MessagesHeader = ({ count }: MessagesHeaderProps) => (
	<div className='fixed left-0 right-0 top-0 z-50 border bg-white p-4 py-5.5 md:left-74 md:right-8'>
		<div className='flex items-center gap-2'>
			<h1 className='text-3xl font-semibold'>Mensagens</h1>
			{typeof count === 'number' && count > 0 && (
				<span className='rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-white'>
					{count}
				</span>
			)}
		</div>
	</div>
)
