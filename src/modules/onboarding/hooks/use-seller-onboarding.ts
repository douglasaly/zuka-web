'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
	createStore,
	fetchUserProfile,
	setOnboardingRole,
	submitVerification,
	updateSellerStore,
} from '@/lib/api/marketplace'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'
import {
	isValidMzMobile,
	isValidStoreEmail,
	STORE_FORM_MESSAGES,
	toE164Mz,
} from '@/lib/validations/store-form'
export interface Province {
	id: string
	name: string
}
export interface Category {
	id: string
	name: string
}
export type SellerStep = 1 | 2 | 3 | 4
export type AccountFormState = {
	name: string
	neighborhood: string
	email: string
	categoryId: string
	provinceId: string
	phone: string
}
export type ProfileFormState = {
	logoUrl: string | null
	bannerUrl: string | null
	description: string
	hasDelivery: boolean
	whatsapp: string
	phone: string
}
export type VerificationFormState = {
	idCardUrl: string | null
	selfieUrl: string | null
}
function formatPhone(value: string) {
	return toE164Mz(value)
}
function resolveStep(
	profile: Awaited<ReturnType<typeof fetchUserProfile>>
): SellerStep {
	if (!profile) return 1
	const onboarding = profile.onboarding
	if (onboarding?.status === 'SUBMITTED') {
		return 4
	}
	if (onboarding?.status === 'APPROVED') {
		return 4
	}
	if (!profile.stores.length) return 1
	const step = onboarding?.currentStep
	if (step === 'VERIFICATION') return 3
	if (step === 'STORE_PROFILE') return 2
	return 2
}
export function useSellerOnboarding() {
	const router = useRouter()
	const queryClient = useQueryClient()
	const {
		data: profile,
		isLoading,
		isFetching,
		refetch,
	} = useQuery({
		queryKey: ['user-profile'],
		queryFn: async () => {
			if (!auth.currentUser) return null
			await createAppSession()
			return fetchUserProfile()
		},
	})
	const [roleBootstrapError, setRoleBootstrapError] = useState<string | null>(
		null
	)
	const [isBootstrappingRole, setIsBootstrappingRole] = useState(false)
	const roleBootstrapAttempted = useRef(false)
	useEffect(() => {
		if (isLoading || isFetching || isBootstrappingRole) return
		if (!auth.currentUser || !profile) return
		if (profile.roles.includes('seller')) return
		if (roleBootstrapAttempted.current) return
		roleBootstrapAttempted.current = true
		setIsBootstrappingRole(true)
		setRoleBootstrapError(null)
		let cancelled = false
		;(async () => {
			try {
				await createAppSession()
				await syncUserToBackend()
				await setOnboardingRole('seller')
				await queryClient.invalidateQueries({
					predicate: (query) =>
						Array.isArray(query.queryKey) &&
						query.queryKey[0] === 'user-profile',
				})
				if (!cancelled) await refetch()
			} catch (err) {
				if (!cancelled) {
					setRoleBootstrapError(
						err instanceof Error
							? err.message
							: 'Erro ao activar perfil de vendedor'
					)
				}
			} finally {
				if (!cancelled) setIsBootstrappingRole(false)
			}
		})()
		return () => {
			cancelled = true
		}
	}, [
		isBootstrappingRole,
		isFetching,
		isLoading,
		profile,
		queryClient,
		refetch,
	])
	const { data: provinces = [] } = useQuery<Province[]>({
		queryKey: ['provinces'],
		queryFn: async () => {
			const res = await fetch('/api/provinces')
			if (!res.ok) throw new Error('Failed to load provinces')
			return res.json()
		},
		enabled: Boolean(profile?.roles.includes('seller')),
	})
	const { data: categories = [] } = useQuery<Category[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await fetch('/api/categories')
			if (!res.ok) throw new Error('Failed to load categories')
			const json = await res.json()
			return json.data ?? json
		},
		enabled: Boolean(profile?.roles.includes('seller')),
	})
	const _initialStep = useMemo(() => resolveStep(profile ?? null), [profile])
	const [step, setStep] = useState<SellerStep>(1)
	useEffect(() => {
		if (profile) {
			setStep(resolveStep(profile))
		}
	}, [profile])
	const [accountForm, setAccountForm] = useState<AccountFormState>({
		name: '',
		neighborhood: '',
		email: '',
		categoryId: '',
		provinceId: '',
		phone: '',
	})
	const [profileForm, setProfileForm] = useState<ProfileFormState>({
		logoUrl: null,
		bannerUrl: null,
		description: '',
		hasDelivery: false,
		whatsapp: '',
		phone: '',
	})
	const [verificationForm, setVerificationForm] =
		useState<VerificationFormState>({
			idCardUrl: null,
			selfieUrl: null,
		})
	useEffect(() => {
		if (profile?.email) {
			setAccountForm((f) => ({ ...f, email: profile.email ?? '' }))
		}
	}, [profile?.email])
	const createStoreMutation = useMutation({
		mutationFn: createStore,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			toast.success('Loja criada com sucesso')
			setStep(2)
		},
		onError: (err) => {
			toast.error(
				err instanceof Error ? err.message : 'Erro ao criar loja'
			)
		},
	})
	const updateStoreMutation = useMutation({
		mutationFn: updateSellerStore,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			toast.success('Perfil da loja atualizado')
			setStep(3)
		},
		onError: (err) => {
			toast.error(
				err instanceof Error
					? err.message
					: 'Erro ao atualizar perfil da loja'
			)
		},
	})
	const verificationMutation = useMutation({
		mutationFn: submitVerification,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			toast.success('Documentos enviados para revisão')
			setStep(4)
		},
		onError: (err) => {
			toast.error(
				err instanceof Error ? err.message : 'Erro ao enviar documentos'
			)
		},
	})
	const isUnauthenticated = !auth.currentUser && !isLoading
	const isGateLoading = isLoading || isBootstrappingRole
	const isPreparingSeller =
		!isUnauthenticated &&
		!isGateLoading &&
		!roleBootstrapError &&
		!profile?.roles.includes('seller')
	const shouldRedirectToDashboard = Boolean(
		profile?.roles.includes('seller') &&
			profile.onboarding?.status === 'APPROVED' &&
			profile.stores.length > 0
	)
	const error =
		createStoreMutation.error?.message ??
		updateStoreMutation.error?.message ??
		verificationMutation.error?.message ??
		null
	const isPending =
		createStoreMutation.isPending ||
		updateStoreMutation.isPending ||
		verificationMutation.isPending
	const canContinueStep1 = Boolean(
		accountForm.name.trim() &&
			accountForm.neighborhood.trim() &&
			accountForm.provinceId &&
			accountForm.categoryId &&
			isValidStoreEmail(accountForm.email) &&
			isValidMzMobile(accountForm.phone)
	)
	const emailError =
		accountForm.email.trim().length > 0 &&
		!isValidStoreEmail(accountForm.email)
			? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email.trim())
				? STORE_FORM_MESSAGES.emailPlaceholder
				: STORE_FORM_MESSAGES.emailInvalid
			: null
	const phoneError =
		accountForm.phone.length > 0 && !isValidMzMobile(accountForm.phone)
			? STORE_FORM_MESSAGES.phoneInvalid
			: null
	const descriptionOk = profileForm.description.trim().length >= 20
	const whatsappOk =
		!profileForm.whatsapp.trim() || isValidMzMobile(profileForm.whatsapp)
	const callPhoneOk =
		!profileForm.phone.trim() || isValidMzMobile(profileForm.phone)
	const deliveryContactOk =
		!profileForm.hasDelivery ||
		Boolean(profileForm.whatsapp.trim() || profileForm.phone.trim())
	const canContinueStep2 =
		descriptionOk && whatsappOk && callPhoneOk && deliveryContactOk
	const descriptionError =
		profileForm.description.length > 0 && !descriptionOk
			? STORE_FORM_MESSAGES.descriptionMin
			: null
	const deliveryError =
		profileForm.hasDelivery && !deliveryContactOk
			? STORE_FORM_MESSAGES.deliveryContactRequired
			: null
	const whatsappError =
		profileForm.whatsapp.length > 0 && !whatsappOk
			? STORE_FORM_MESSAGES.phoneInvalid
			: null
	const callPhoneError =
		profileForm.phone.length > 0 && !callPhoneOk
			? STORE_FORM_MESSAGES.phoneInvalid
			: null
	function retryRoleBootstrap() {
		roleBootstrapAttempted.current = false
		setRoleBootstrapError(null)
		void refetch()
	}
	function handleCreateStore() {
		createStoreMutation.mutate({
			name: accountForm.name,
			neighborhood: accountForm.neighborhood,
			provinceId: accountForm.provinceId,
			categoryId: accountForm.categoryId || undefined,
			email: accountForm.email.trim(),
			phone: formatPhone(accountForm.phone),
		})
	}
	function handleUpdateStore() {
		updateStoreMutation.mutate({
			logoUrl: profileForm.logoUrl ?? undefined,
			bannerUrl: profileForm.bannerUrl ?? undefined,
			description: profileForm.description.trim(),
			whatsapp: formatPhone(profileForm.whatsapp) || undefined,
			phone: formatPhone(profileForm.phone) || undefined,
			hasDelivery: profileForm.hasDelivery,
			currentStep: 'VERIFICATION',
		})
	}
	function handleSubmitVerification() {
		if (!verificationForm.idCardUrl || !verificationForm.selfieUrl) {
			return
		}
		verificationMutation.mutate({
			idCardUrl: verificationForm.idCardUrl,
			selfieUrl: verificationForm.selfieUrl,
		})
	}
	function goBackToMarketplace() {
		router.push('/')
	}
	function redirectToDashboard() {
		router.replace('/dashboard/seller')
	}
	return {
		provinces,
		categories,
		step,
		setStep,
		accountForm,
		setAccountForm,
		profileForm,
		setProfileForm,
		verificationForm,
		setVerificationForm,
		isUnauthenticated,
		isGateLoading,
		roleBootstrapError,
		isPreparingSeller,
		shouldRedirectToDashboard,
		error,
		isPending,
		canContinueStep1,
		canContinueStep2,
		emailError,
		phoneError,
		descriptionError,
		deliveryError,
		whatsappError,
		callPhoneError,
		retryRoleBootstrap,
		handleCreateStore,
		handleUpdateStore,
		handleSubmitVerification,
		goBackToMarketplace,
		redirectToDashboard,
	}
}
