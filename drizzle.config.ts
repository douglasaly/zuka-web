import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE URL must be configured')
}

export default defineConfig({
	out: './migrations',
	schema: './src/db/schema',
	dialect: 'postgresql',
	verbose: true,
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
})
