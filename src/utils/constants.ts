if (!process.env.APP_SESSION_COOKIE) {
	throw new Error('Missing required environment variable: APP_SESSION_COOKIE')
}

export const SESSION_COOKIE = process.env.APP_SESSION_COOKIE
