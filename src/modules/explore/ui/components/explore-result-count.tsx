type ExploreResultsCountProps = {
	count: number
	singular: string
	plural: string
}

export const ExploreResultsCount = ({
	count,
	singular,
	plural,
}: ExploreResultsCountProps) => (
	<p className='text-sm text-muted-foreground'>
		{count} {count === 1 ? singular : plural}
	</p>
)
