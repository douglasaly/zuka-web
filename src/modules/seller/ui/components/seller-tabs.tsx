'use client'

const TABS = ['Resumo', 'Produtos', 'Pedidos'] as const

type SellerTabsProps = {
	value: string
	onChange: (value: string) => void
}

export const SellerTabs = ({ value, onChange }: SellerTabsProps) => (
	<div
		role='tablist'
		className='inline-flex w-full rounded-xl bg-muted/60 p-1.5'
	>
		{TABS.map((tab) => {
			const isActive = value === tab

			return (
				<button
					key={tab}
					type='button'
					role='tab'
					aria-selected={isActive}
					onClick={() => onChange(tab)}
					className={`flex-1 rounded-lg py-3 text-sm font-semibold transition-colors ${
						isActive
							? 'bg-white text-foreground shadow-sm'
							: 'text-muted-foreground hover:text-foreground'
					}`}
				>
					{tab}
				</button>
			)
		})}
	</div>
)