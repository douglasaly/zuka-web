'use client'
import { useEffect, useState } from 'react'
import type { SignupCategory, SignupProvince } from '../constants'
export function useSignupCatalogs() {
	const [provinces, setProvinces] = useState<SignupProvince[]>([])
	const [categories, setCategories] = useState<SignupCategory[]>([])
	useEffect(() => {
		fetch('/api/provinces')
			.then((r) => r.json())
			.then((d) => setProvinces(Array.isArray(d) ? d : []))
			.catch(() => {})
		fetch('/api/categories')
			.then((r) => r.json())
			.then((d) =>
				setCategories(
					Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []
				)
			)
			.catch(() => {})
	}, [])
	return { provinces, categories }
}
