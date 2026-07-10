'use client'

import { useEffect } from 'react'

type ShortcutMap = Record<string, () => void>

export function useShortcuts(shortcuts: ShortcutMap) {
	useEffect(() => {
		function handler(e: KeyboardEvent) {
			const target = e.target as HTMLElement
			if (
				target.tagName === 'INPUT' ||
				target.tagName === 'TEXTAREA' ||
				target.tagName === 'SELECT' ||
				target.isContentEditable
			) {
				return
			}

			const key = e.key.toLowerCase()
			const action = shortcuts[key]
			if (action) {
				e.preventDefault()
				action()
			}
		}

		window.addEventListener('keydown', handler)
		return () => window.removeEventListener('keydown', handler)
	}, [shortcuts])
}
