'use client'
import { useState } from 'react'

type UseCurrentLocationOptions = {
	onResolved: (neighborhood: string) => void
}
export function useCurrentLocation({ onResolved }: UseCurrentLocationOptions) {
	const [locationLoading, setLocationLoading] = useState(false)
	const [locationError, setLocationError] = useState<string | null>(null)
	function requestCurrentLocation() {
		setLocationLoading(true)
		setLocationError(null)
		if (!navigator.geolocation) {
			setLocationError('Geolocalização não suportada neste browser.')
			setLocationLoading(false)
			return
		}
		navigator.geolocation.getCurrentPosition(
			async ({ coords }) => {
				try {
					const res = await fetch(
						`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=16&addressdetails=1`,
						{ headers: { 'Accept-Language': 'pt' } }
					)
					const data = await res.json()
					const addr = data.address ?? {}
					const parts = [
						addr.neighbourhood ??
							addr.suburb ??
							addr.quarter ??
							addr.residential ??
							addr.road,
						addr.city ??
							addr.town ??
							addr.village ??
							addr.municipality,
					].filter(Boolean)
					const formatted =
						parts.join(', ') ||
						data.display_name
							?.split(',')
							.slice(0, 2)
							.join(',')
							.trim() ||
						''
					onResolved(formatted)
				} catch {
					setLocationError(
						'Não foi possível obter o endereço. Preenche manualmente.'
					)
				} finally {
					setLocationLoading(false)
				}
			},
			(err) => {
				const msgs: Record<number, string> = {
					1: 'Permissão de localização negada.',
					2: 'Localização não disponível.',
					3: 'Tempo limite excedido.',
				}
				setLocationError(msgs[err.code] ?? 'Erro ao obter localização.')
				setLocationLoading(false)
			},
			{ timeout: 10000, enableHighAccuracy: true }
		)
	}
	return {
		locationLoading,
		locationError,
		requestCurrentLocation,
	}
}
