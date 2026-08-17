'use client'
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
export type SellerPageMeta = {
	title?: string | null
	crumbs?: string[] | null
}
type SellerPageMetaContextValue = {
	meta: SellerPageMeta
	setMeta: (meta: SellerPageMeta) => void
}
const SellerPageMetaContext = createContext<SellerPageMetaContextValue | null>(
	null
)
export function SellerPageMetaProvider({ children }: { children: ReactNode }) {
	const [meta, setMeta] = useState<SellerPageMeta>({})
	return (
		<SellerPageMetaContext.Provider value={{ meta, setMeta }}>
			{children}
		</SellerPageMetaContext.Provider>
	)
}
export function useSellerPageMeta() {
	const ctx = useContext(SellerPageMetaContext)
	if (!ctx) {
		throw new Error(
			'useSellerPageMeta must be used within SellerPageMetaProvider'
		)
	}
	return ctx
}
export function useSetSellerPageMeta(meta: SellerPageMeta) {
	const { setMeta } = useSellerPageMeta()
	const title = meta.title ?? null
	const crumbsKey = meta.crumbs?.join('|') ?? ''
	useEffect(() => {
		setMeta({
			title,
			crumbs: crumbsKey ? crumbsKey.split('|') : null,
		})
		return () => setMeta({})
	}, [title, crumbsKey, setMeta])
}
