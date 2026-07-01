'use client'

import { CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
	createStore,
	fetchUserProfile,
	submitVerification,
	updateSellerStore,
} from '@/lib/api/marketplace'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import { FileUploadCard } from '../components/file-upload-card'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '../components/onboarding-form-card'
import { OnboardingShell } from '../components/onboarding-shell'
import { PhoneInput } from '../components/phone-input'

interface Province {
	id: string
	name: string
}

interface Category {
	id: string
	name: string
}

type SellerStep = 1 | 2 | 3 | 4

function formatPhone(value: string) {
	const digits = value.replace(/\D/g, '')
	return digits ? `+258${digits}` : ''
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

export const SellerOnboardingView = () => {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { data: profile, isLoading } = useQuery({
		queryKey: ['user-profile'],
		queryFn: async () => {
			if (!auth.currentUser) return null
			await createAppSession()
			return fetchUserProfile()
		},
	})

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
			return res.json()
		},
		enabled: Boolean(profile?.roles.includes('seller')),
	})

	const initialStep = useMemo(() => resolveStep(profile ?? null), [profile])
	const [step, setStep] = useState<SellerStep>(1)

	useEffect(() => {
		if (profile) {
			setStep(resolveStep(profile))
		}
	}, [profile])

	const [accountForm, setAccountForm] = useState({
		name: '',
		neighborhood: '',
		email: '',
		categoryId: '',
		provinceId: '',
		phone: '',
	})

	const [profileForm, setProfileForm] = useState({
		logoUrl: null as string | null,
		bannerUrl: null as string | null,
		description: '',
		hasDelivery: false,
		whatsapp: '',
		phone: '',
	})

	const [verificationForm, setVerificationForm] = useState({
		idCardUrl: null as string | null,
		selfieUrl: null as string | null,
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
			setStep(2)
		},
	})

	const updateStoreMutation = useMutation({
		mutationFn: updateSellerStore,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			setStep(3)
		},
	})

	const verificationMutation = useMutation({
		mutationFn: submitVerification,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-profile'] })
			setStep(4)
		},
	})

	if (!auth.currentUser && !isLoading) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Precisas de entrar na tua conta para registar a tua loja.
				</p>
				<Button
					render={
						<Link href='/auth/login?next=/onboarding/seller'>
							Entrar
						</Link>
					}
				/>
			</div>
		)
	}

	if (isLoading) {
		return (
			<div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
				A carregar...
			</div>
		)
	}

	if (!profile?.roles.includes('seller')) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-muted-foreground'>
					Ainda não escolheste o perfil de vendedor.
				</p>
				<Button
					render={<Link href='/onboarding'>Escolher perfil</Link>}
				/>
			</div>
		)
	}

	if (
		profile.onboarding?.status === 'APPROVED' &&
		profile.stores.length > 0
	) {
		router.replace('/dashboard/seller')
		return null
	}

	const error =
		createStoreMutation.error?.message ??
		updateStoreMutation.error?.message ??
		verificationMutation.error?.message ??
		null

	const isPending =
		createStoreMutation.isPending ||
		updateStoreMutation.isPending ||
		verificationMutation.isPending

	const canContinueStep1 =
		accountForm.name.trim() &&
		accountForm.neighborhood.trim() &&
		accountForm.provinceId &&
		accountForm.categoryId

	if (step === 1) {
		return (
			<OnboardingShell
				title='Criar conta de loja'
				subtitle='Preenche os dados da tua loja'
				currentStep={1}
				onBack={() => router.push('/onboarding')}
				footer={
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={isPending || !canContinueStep1}
						onClick={() => {
							createStoreMutation.mutate({
								name: accountForm.name,
								neighborhood: accountForm.neighborhood,
								provinceId: accountForm.provinceId,
								categoryId: accountForm.categoryId || undefined,
								email: accountForm.email || undefined,
								phone:
									formatPhone(accountForm.phone) || undefined,
							})
						}}
					>
						{isPending ? 'A guardar...' : 'Continuar'}
					</Button>
				}
			>
				<OnboardingFormCard>
					<OnboardingField label='Nome da loja'>
						<Input
							required
							value={accountForm.name}
							onChange={(e) =>
								setAccountForm((f) => ({
									...f,
									name: e.target.value,
								}))
							}
							placeholder='Ex: Loja da Fátima'
							className={onboardingInputClass}
						/>
					</OnboardingField>

					<OnboardingField label='Cidade / Bairro'>
						<Input
							required
							value={accountForm.neighborhood}
							onChange={(e) =>
								setAccountForm((f) => ({
									...f,
									neighborhood: e.target.value,
								}))
							}
							placeholder='Ex: Maputo · Baixa'
							className={onboardingInputClass}
						/>
					</OnboardingField>

					<OnboardingField label='Email'>
						<Input
							type='email'
							value={accountForm.email}
							onChange={(e) =>
								setAccountForm((f) => ({
									...f,
									email: e.target.value,
								}))
							}
							placeholder='exemplo@email.com'
							className={onboardingInputClass}
						/>
					</OnboardingField>

					<OnboardingField label='Categoria principal'>
						<select
							required
							value={accountForm.categoryId}
							onChange={(e) =>
								setAccountForm((f) => ({
									...f,
									categoryId: e.target.value,
								}))
							}
							className={`${onboardingInputClass} w-full text-sm`}
						>
							<option value=''>Selecionar categoria</option>
							{categories.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</OnboardingField>

					<OnboardingField label='Província'>
						<select
							required
							value={accountForm.provinceId}
							onChange={(e) =>
								setAccountForm((f) => ({
									...f,
									provinceId: e.target.value,
								}))
							}
							className={`${onboardingInputClass} w-full text-sm`}
						>
							<option value=''>Selecionar província</option>
							{provinces.map((p) => (
								<option key={p.id} value={p.id}>
									{p.name}
								</option>
							))}
						</select>
					</OnboardingField>

					<OnboardingField label='Número de telefone'>
						<PhoneInput
							value={accountForm.phone}
							onChange={(phone) =>
								setAccountForm((f) => ({ ...f, phone }))
							}
						/>
					</OnboardingField>
				</OnboardingFormCard>

				{error && (
					<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
						{error}
					</p>
				)}
			</OnboardingShell>
		)
	}

	if (step === 2) {
		return (
			<OnboardingShell
				title='Configura a tua loja'
				subtitle='Personaliza o perfil da tua loja'
				currentStep={2}
				onBack={() => setStep(1)}
				footer={
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={isPending}
						onClick={() => {
							updateStoreMutation.mutate({
								logoUrl: profileForm.logoUrl ?? undefined,
								bannerUrl: profileForm.bannerUrl ?? undefined,
								description:
									profileForm.description || undefined,
								whatsapp:
									formatPhone(profileForm.whatsapp) ||
									undefined,
								phone:
									formatPhone(profileForm.phone) || undefined,
								hasDelivery: profileForm.hasDelivery,
								currentStep: 'VERIFICATION',
							})
						}}
					>
						{isPending ? 'A guardar...' : 'Continuar'}
					</Button>
				}
			>
				<OnboardingFormCard>
					<FileUploadCard
						label='Logo da loja'
						hint='Carregar logo circular'
						variant='logo'
						purpose='store-logo'
						value={profileForm.logoUrl}
						onChange={(logoUrl) =>
							setProfileForm((f) => ({ ...f, logoUrl }))
						}
					/>

					<FileUploadCard
						label='Banner da loja'
						hint='Carregar imagem de capa'
						variant='banner'
						purpose='store-banner'
						value={profileForm.bannerUrl}
						onChange={(bannerUrl) =>
							setProfileForm((f) => ({ ...f, bannerUrl }))
						}
					/>

					<OnboardingField label='Descrição curta'>
						<Textarea
							value={profileForm.description}
							onChange={(e) =>
								setProfileForm((f) => ({
									...f,
									description: e.target.value,
								}))
							}
							placeholder='Descreve a tua loja em poucas palavras...'
							className={`${onboardingInputClass} min-h-24 resize-none`}
						/>
					</OnboardingField>
				</OnboardingFormCard>

				<OnboardingFormCard>
					<div className='flex items-center justify-between gap-4'>
						<div>
							<p className='text-sm font-semibold'>
								Fazes entregas?
							</p>
							<p className='text-xs text-muted-foreground'>
								Entrega ao domicílio
							</p>
						</div>
						<Switch
							checked={profileForm.hasDelivery}
							onCheckedChange={(hasDelivery) =>
								setProfileForm((f) => ({ ...f, hasDelivery }))
							}
						/>
					</div>

					<OnboardingField label='Número WhatsApp'>
						<PhoneInput
							value={profileForm.whatsapp}
							onChange={(whatsapp) =>
								setProfileForm((f) => ({ ...f, whatsapp }))
							}
						/>
					</OnboardingField>

					<OnboardingField
						label='Número para chamadas'
						hint='Número de telefone fixo ou móvel para clientes ligarem'
					>
						<PhoneInput
							value={profileForm.phone}
							onChange={(phone) =>
								setProfileForm((f) => ({ ...f, phone }))
							}
							placeholder='21 123 456'
						/>
					</OnboardingField>
				</OnboardingFormCard>

				{error && (
					<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
						{error}
					</p>
				)}
			</OnboardingShell>
		)
	}

	if (step === 3) {
		return (
			<OnboardingShell
				title='Verificação de identidade'
				subtitle='Precisamos verificar a tua identidade. A tua conta será aprovada em até 24 horas.'
				currentStep={3}
				onBack={() => setStep(2)}
				maxWidth='lg'
				footer={
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={
							isPending ||
							!verificationForm.idCardUrl ||
							!verificationForm.selfieUrl
						}
						onClick={() => {
							if (
								!verificationForm.idCardUrl ||
								!verificationForm.selfieUrl
							) {
								return
							}
							verificationMutation.mutate({
								idCardUrl: verificationForm.idCardUrl,
								selfieUrl: verificationForm.selfieUrl,
							})
						}}
					>
						{isPending ? 'A enviar...' : 'Enviar para revisão'}
					</Button>
				}
			>
				<div className='grid gap-4 sm:grid-cols-2'>
					<FileUploadCard
						label=''
						hint=''
						variant='document'
						purpose='verification-id'
						value={verificationForm.idCardUrl}
						onChange={(idCardUrl) =>
							setVerificationForm((f) => ({ ...f, idCardUrl }))
						}
					/>
					<FileUploadCard
						label=''
						hint=''
						variant='selfie'
						purpose='verification-selfie'
						value={verificationForm.selfieUrl}
						onChange={(selfieUrl) =>
							setVerificationForm((f) => ({ ...f, selfieUrl }))
						}
					/>
				</div>

				<div className='flex items-start gap-3 rounded-2xl bg-emerald-50 p-4'>
					<div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white'>
						<CheckCircle2 className='size-4' />
					</div>
					<p className='text-sm leading-relaxed text-emerald-900'>
						Os teus documentos são tratados de forma confidencial e
						segura. Só são usados para verificar a tua identidade.
					</p>
				</div>

				{error && (
					<p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
						{error}
					</p>
				)}
			</OnboardingShell>
		)
	}

	return (
		<div className='flex flex-1 flex-col items-center justify-center bg-background px-4 py-12'>
			<div className='w-full max-w-md space-y-6 text-center'>
				<div className='mx-auto flex size-24 items-center justify-center rounded-full bg-orange-50'>
					<Clock className='size-12 text-secondary' />
				</div>

				<div className='space-y-3'>
					<h1 className='font-heading text-2xl font-bold sm:text-3xl'>
						A tua loja está em revisão!
					</h1>
					<p className='text-sm leading-relaxed text-muted-foreground sm:text-base'>
						A nossa equipa vai verificar os teus dados. Vais receber
						uma notificação quando a tua conta for aprovada.
					</p>
				</div>

				<Button
					render={<Link href='/' />}
					variant='outline'
					className='h-12 w-full rounded-full text-base font-semibold'
					size='lg'
				>
					Voltar ao início
				</Button>
			</div>
		</div>
	)
}
