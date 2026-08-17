import { ImageResponse } from 'next/og'

export const ogSize = {
	width: 1200,
	height: 630,
}

type OgImageProps = {
	title: string
	subtitle?: string
	eyebrow?: string
	imageUrl?: string | null
}

function OgFrame({
	title,
	subtitle,
	eyebrow = 'Zuka',
	imageUrl,
}: OgImageProps) {
	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				display: 'flex',
				background: '#111111',
				color: '#fafafa',
				fontFamily: 'sans-serif',
			}}
		>
			{imageUrl ? (
				// biome-ignore lint/performance/noImgElement: next/og (Satori) requires a raw img
				<img
					src={imageUrl}
					alt=''
					width={630}
					height={630}
					style={{
						width: 630,
						height: 630,
						objectFit: 'cover',
					}}
				/>
			) : null}
			<div
				style={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					padding: imageUrl ? '64px 72px' : '80px 88px',
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
					}}
				>
					<div
						style={{
							width: 56,
							height: 56,
							borderRadius: 16,
							background: '#fafafa',
							color: '#111111',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: 28,
							fontWeight: 800,
						}}
					>
						Z
					</div>
					<div
						style={{
							fontSize: 28,
							fontWeight: 700,
							letterSpacing: -0.5,
						}}
					>
						{eyebrow}
					</div>
				</div>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 18,
					}}
				>
					<div
						style={{
							fontSize: imageUrl ? 52 : 64,
							fontWeight: 800,
							lineHeight: 1.1,
							letterSpacing: -1.4,
							maxWidth: imageUrl ? 460 : 980,
						}}
					>
						{title}
					</div>
					{subtitle ? (
						<div
							style={{
								fontSize: 28,
								color: '#cfcfcf',
								maxWidth: imageUrl ? 460 : 900,
							}}
						>
							{subtitle}
						</div>
					) : null}
				</div>
			</div>
		</div>
	)
}

export function renderOgImage(props: OgImageProps) {
	try {
		return new ImageResponse(<OgFrame {...props} />, { ...ogSize })
	} catch {
		return new ImageResponse(<OgFrame {...props} imageUrl={null} />, {
			...ogSize,
		})
	}
}
