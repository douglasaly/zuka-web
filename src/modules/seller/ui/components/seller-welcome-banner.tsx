type SellerWelcomeBannerProps = {
	storeName: string
}

export const SellerWelcomeBanner = ({
	storeName,
}: SellerWelcomeBannerProps) => (
	<div className='rounded-2xl bg-linear-to-br from-neutral-900 to-neutral-800 px-8 py-10 text-white'>
		<p className='text-sm text-neutral-300'>Bem-vinda de volta</p>
		<h1 className='mt-1 font-heading text-3xl font-bold'>
			{storeName} <span aria-hidden>👋</span>
		</h1>
	</div>
)
