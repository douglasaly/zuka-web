'use client'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useState } from 'react'
import {
	createStore,
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
import {
	type BuyerFormState,
	INITIAL_BUYER_FORM,
	INITIAL_SELLER_ACCOUNT_FORM,
	INITIAL_SELLER_PROFILE_FORM,
	INITIAL_SELLER_VERIFICATION_FORM,
	type SellerAccountFormState,
	type SellerProfileFormState,
	type SellerVerificationFormState,
	type SignupFlowStep,
} from '../constants'
import { friendlySignupError } from '../lib/friendly-error'
import { useCurrentLocation } from './use-current-location'
import { useSignupCatalogs } from './use-signup-catalogs'

export function useSignupFlow() {
	const [step, setStep] = useState<SignupFlowStep>('role')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const { provinces, categories } = useSignupCatalogs()

	const [buyerForm, setBuyerForm] =
		useState<BuyerFormState>(INITIAL_BUYER_FORM)
	const [s1, setS1] = useState<SellerAccountFormState>(
		INITIAL_SELLER_ACCOUNT_FORM
	)
	const [s2, setS2] = useState<SellerProfileFormState>(
		INITIAL_SELLER_PROFILE_FORM
	)
	const [s3, setS3] = useState<SellerVerificationFormState>(
		INITIAL_SELLER_VERIFICATION_FORM
	)

	const { locationLoading, locationError, requestCurrentLocation } =
		useCurrentLocation({
			onResolved: (neighborhood) =>
				setS1((f) => ({ ...f, neighborhood })),
		})

	function goBack(to: SignupFlowStep) {
		setStep(to)
		setError(null)
	}

	async function handleBuyerContinue() {
		setLoading(true)
		setError(null)
		try {
			const cred = await createUserWithEmailAndPassword(
				auth,
				buyerForm.email,
				buyerForm.password
			)
			if (buyerForm.name) {
				await updateProfile(cred.user, { displayName: buyerForm.name })
			}
			await syncUserToBackend()
			await createAppSession()
			await setOnboardingRole('buyer')
			setStep('buyer-welcome')
		} catch (e) {
			setError(friendlySignupError(e))
		} finally {
			setLoading(false)
		}
	}

	async function handleSellerStep1() {
		setLoading(true)
		setError(null)

		if (s1.password.length < 8) {
			setError(STORE_FORM_MESSAGES.passwordMin)
			setLoading(false)
			return
		}
		if (s1.password !== s1.confirmPassword) {
			setError(STORE_FORM_MESSAGES.passwordMismatch)
			setLoading(false)
			return
		}
		if (!isValidStoreEmail(s1.email)) {
			const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
				s1.email.trim()
			)
			setError(
				looksLikeEmail
					? STORE_FORM_MESSAGES.emailPlaceholder
					: STORE_FORM_MESSAGES.emailInvalid
			)
			setLoading(false)
			return
		}
		if (!isValidMzMobile(s1.phone)) {
			setError(STORE_FORM_MESSAGES.phoneInvalid)
			setLoading(false)
			return
		}

		try {
			await createUserWithEmailAndPassword(auth, s1.email, s1.password)
			await syncUserToBackend()
			await createAppSession()
			await setOnboardingRole('seller')
			await createStore({
				name: s1.storeName,
				neighborhood: s1.neighborhood,
				provinceId: s1.provinceId,
				categoryId: s1.categoryId || undefined,
				email: s1.email,
				phone: toE164Mz(s1.phone),
			})
			setStep('seller-2')
		} catch (e) {
			setError(friendlySignupError(e))
		} finally {
			setLoading(false)
		}
	}

	async function handleSellerStep2() {
		setLoading(true)
		setError(null)

		if (s2.description.trim().length < 20) {
			setError(STORE_FORM_MESSAGES.descriptionMin)
			setLoading(false)
			return
		}
		if (s2.hasDelivery && !s2.whatsapp.trim() && !s2.phone.trim()) {
			setError(STORE_FORM_MESSAGES.deliveryContactRequired)
			setLoading(false)
			return
		}
		if (s2.whatsapp.trim() && !isValidMzMobile(s2.whatsapp)) {
			setError(STORE_FORM_MESSAGES.phoneInvalid)
			setLoading(false)
			return
		}
		if (s2.phone.trim() && !isValidMzMobile(s2.phone)) {
			setError(STORE_FORM_MESSAGES.phoneInvalid)
			setLoading(false)
			return
		}

		try {
			await updateSellerStore({
				logoUrl: s2.logoUrl ?? undefined,
				bannerUrl: s2.bannerUrl ?? undefined,
				description: s2.description.trim(),
				whatsapp: toE164Mz(s2.whatsapp) || undefined,
				phone: toE164Mz(s2.phone) || undefined,
				hasDelivery: s2.hasDelivery,
				currentStep: 'VERIFICATION',
			})
			setStep('seller-3')
		} catch (e) {
			setError(e instanceof Error ? e.message : 'Erro ao guardar')
		} finally {
			setLoading(false)
		}
	}

	async function handleSellerStep3() {
		if (!s3.idCardUrl || !s3.selfieUrl) return
		setLoading(true)
		setError(null)
		try {
			await submitVerification({
				idCardUrl: s3.idCardUrl,
				selfieUrl: s3.selfieUrl,
			})
			setStep('seller-4')
		} catch (e) {
			setError(
				e instanceof Error ? e.message : 'Erro ao enviar documentos'
			)
		} finally {
			setLoading(false)
		}
	}

	return {
		step,
		setStep,
		loading,
		error,
		provinces,
		categories,
		buyerForm,
		setBuyerForm,
		s1,
		setS1,
		s2,
		setS2,
		s3,
		setS3,
		locationLoading,
		locationError,
		requestCurrentLocation,
		goBack,
		handleBuyerContinue,
		handleSellerStep1,
		handleSellerStep2,
		handleSellerStep3,
	}
}
