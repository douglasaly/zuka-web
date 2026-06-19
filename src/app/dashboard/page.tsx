import { cookies as getCookies } from 'next/headers'
import { SESSION_COOKIE } from '@/utils/constants'

const Page = async () => {
	const cookies = await getCookies()

	const session = cookies.get(SESSION_COOKIE)

	return (
		<div>
			Hello from dashboard
			{JSON.stringify(session, null, 2)}
		</div>
	)
}

export default Page
