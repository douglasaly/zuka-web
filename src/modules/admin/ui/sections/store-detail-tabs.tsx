import {
	STORE_DETAIL_TABS,
	type StoreDetailTab,
} from '@/modules/admin/hooks/use-store-detail'

type StoreDetailTabsProps = {
	tab: StoreDetailTab
	onTabChange: (tab: StoreDetailTab) => void
}

export function StoreDetailTabs({ tab, onTabChange }: StoreDetailTabsProps) {
	return (
		<div className='flex gap-1 border-b border-border/60'>
			{STORE_DETAIL_TABS.map((t) => (
				<button
					key={t}
					type='button'
					onClick={() => onTabChange(t)}
					className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
				>
					{t}
				</button>
			))}
		</div>
	)
}
