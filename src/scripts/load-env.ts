import { config } from 'dotenv'
import { resolve } from 'node:path'

// Next.js uses `.env.local`; plain `dotenv/config` only loads `.env`.
config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })
