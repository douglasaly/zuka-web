import type { NextConfig } from 'next'

const r2PublicHost = process.env.R2_PUBLIC_URL
	? new URL(process.env.R2_PUBLIC_URL).hostname
	: null

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: '*.supabase.co',
			},
			{
				protocol: 'https',
				hostname: '*.supabase.in',
			},

			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
			},
			{ protocol: 'https', hostname: 'placehold.in' },
			...(r2PublicHost
				? [
						{
							protocol: 'https' as const,
							hostname: r2PublicHost,
						},
					]
				: []),
		],
	},
}

export default nextConfig
