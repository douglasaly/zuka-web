import { LanguageHeader } from '../sections/language-header'
import { LanguageOptions } from '../sections/language-options'

export const LanguageView = () => (
	<main
		id='main-content'
		className='mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))] sm:max-w-xl sm:px-6 sm:pt-10 sm:pb-12'
	>
		<div className='space-y-8 sm:space-y-10'>
			<LanguageHeader />
			<LanguageOptions />
		</div>
	</main>
)
