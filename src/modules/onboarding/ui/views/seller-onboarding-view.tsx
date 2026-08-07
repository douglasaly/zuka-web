'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
	createStore,
	fetchUserProfile,
	setOnboardingRole,
	submitVerification,
	updateSellerStore,
} from '@/lib/api/marketplace'
import { setViewAsBuyerMode } from '@/lib/auth/view-as-buyer'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'
import {
	isValidMzMobile,
	isValidStoreEmail,
	STORE_FORM_MESSAGES,
	toE164Mz,
} from '@/lib/validations/store-form'
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

export const SellerOnboardingView = () => {
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

	// Existing buyers ("Abrir uma loja") land here directly — assign seller role.
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

	if (isLoading || isBootstrappingRole) {
		return (
			<div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
				A carregar...
			</div>
		)
	}

	if (roleBootstrapError) {
		return (
			<div className='flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center'>
				<p className='text-sm text-destructive'>{roleBootstrapError}</p>
				<Button
					type='button'
					onClick={() => {
						roleBootstrapAttempted.current = false
						setRoleBootstrapError(null)
						void refetch()
					}}
				>
					Tentar novamente
				</Button>
			</div>
		)
	}

	if (!profile?.roles.includes('seller')) {
		return (
			<div className='flex flex-1 items-center justify-center text-sm text-muted-foreground'>
				A preparar a tua loja...
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

	if (step === 1) {
		return (
			<OnboardingShell
				title='Dados da tua loja'
				subtitle='Começa com o essencial. Podes editar tudo depois no painel.'
				currentStep={1}
				onBack={() => router.push('/')}
				backLabel='Voltar ao marketplace'
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
								email: accountForm.email.trim(),
								phone: formatPhone(accountForm.phone),
							})
						}}
					>
						{isPending ? 'A criar a loja…' : 'Continuar'}
					</Button>
				}
			>
				<OnboardingFormCard>
					<OnboardingField
						label='Nome da loja'
						hint='Como os clientes vão encontrar-te no Zuka'
					>
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

					<OnboardingField
						label='Cidade / Bairro'
						hint='Ajuda os clientes a perceber onde estás'
					>
						<Input
							required
							value={accountForm.neighborhood}
							onChange={(e) =>
								setAccountForm((f) => ({
									...f,
									neighborhood: e.target.value,
								}))
							}
							placeholder='Ex: Maputo, Baixa'
							className={onboardingInputClass}
						/>
					</OnboardingField>

					<OnboardingField label='Email' error={emailError}>
						<Input
							type='email'
							required
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

					<OnboardingField
						label='Número de Celular'
						hint='Formato +258 seguido de 9 dígitos (82–88)'
						error={phoneError}
					>
						<PhoneInput
							value={accountForm.phone}
							onChange={(phone) =>
								setAccountForm((f) => ({ ...f, phone }))
							}
						/>
					</OnboardingField>
				</OnboardingFormCard>

				{error && (
					<p
						role='alert'
						className='rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive'
					>
						{error}
					</p>
				)}
			</OnboardingShell>
		)
	}

	if (step === 2) {
		return (
			<OnboardingShell
				title='Perfil da loja'
				subtitle='Imagens e contacto ajudam os clientes a confiar e a falar contigo.'
				currentStep={2}
				onBack={() => setStep(1)}
				footer={
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={isPending || !canContinueStep2}
						onClick={() => {
							updateStoreMutation.mutate({
								logoUrl: profileForm.logoUrl ?? undefined,
								bannerUrl: profileForm.bannerUrl ?? undefined,
								description: profileForm.description.trim(),
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
						{isPending ? 'A guardar…' : 'Continuar'}
					</Button>
				}
			>
				<OnboardingFormCard
					title='Imagem da loja'
					description='Opcional por agora — podes actualizar depois.'
				>
					<FileUploadCard
						label='Logo da loja'
						hint='Preferência: imagem quadrada'
						variant='logo'
						purpose='store-logo'
						value={profileForm.logoUrl}
						onChange={(logoUrl) =>
							setProfileForm((f) => ({ ...f, logoUrl }))
						}
					/>

					<FileUploadCard
						label='Banner da loja'
						hint='Imagem larga para o topo da página'
						variant='banner'
						purpose='store-banner'
						value={profileForm.bannerUrl}
						onChange={(bannerUrl) =>
							setProfileForm((f) => ({ ...f, bannerUrl }))
						}
					/>

					<OnboardingField
						label='Descrição curta'
						hint='Mínimo de 20 caracteres'
						error={descriptionError}
					>
						<Textarea
							value={profileForm.description}
							onChange={(e) =>
								setProfileForm((f) => ({
									...f,
									description: e.target.value,
								}))
							}
							placeholder='O que vendes e o que te distingue…'
							className={`${onboardingInputClass} min-h-24 resize-none`}
						/>
					</OnboardingField>
				</OnboardingFormCard>

				<OnboardingFormCard
					title='Contacto e entrega'
					description='Os clientes usam estes dados para WhatsApp e chamadas.'
				>
					<div className='flex items-center justify-between gap-4'>
						<div>
							<p className='text-sm font-semibold'>
								Ofereces entrega?
							</p>
							<p className='text-xs text-muted-foreground'>
								Mostra se fazes entrega ao domicílio
							</p>
						</div>
						<Switch
							checked={profileForm.hasDelivery}
							onCheckedChange={(hasDelivery) =>
								setProfileForm((f) => ({ ...f, hasDelivery }))
							}
						/>
					</div>

					{deliveryError ? (
						<p role='alert' className='text-xs text-destructive'>
							{deliveryError}
						</p>
					) : null}

					<OnboardingField
						label='WhatsApp'
						hint='Número móvel moçambicano (82–88)'
						optional={!profileForm.hasDelivery}
						error={whatsappError}
					>
						<PhoneInput
							value={profileForm.whatsapp}
							onChange={(whatsapp) =>
								setProfileForm((f) => ({ ...f, whatsapp }))
							}
						/>
					</OnboardingField>

					<OnboardingField
						label='Telefone para chamadas'
						hint='Número móvel moçambicano (82–88)'
						optional={!profileForm.hasDelivery}
						error={callPhoneError}
					>
						<PhoneInput
							value={profileForm.phone}
							onChange={(phone) =>
								setProfileForm((f) => ({ ...f, phone }))
							}
						/>
					</OnboardingField>
				</OnboardingFormCard>

				{error && (
					<p
						role='alert'
						className='rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive'
					>
						{error}
					</p>
				)}
			</OnboardingShell>
		)
	}

	if (step === 3) {
		return (
			<OnboardingShell
				title='Confirma a tua identidade'
				subtitle='Envia o documento e uma selfie. A equipa Zuka revê o pedido — normalmente em até 24 horas.'
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
						{isPending
							? 'A enviar documentos…'
							: 'Enviar para revisão'}
					</Button>
				}
			>
				<div className='grid gap-4 sm:grid-cols-2'>
					<FileUploadCard
						label='Documento de identificação'
						hint='BI ou passaporte, foto nítida da frente'
						variant='document'
						purpose='verification-id'
						value={verificationForm.idCardUrl}
						onChange={(idCardUrl) =>
							setVerificationForm((f) => ({ ...f, idCardUrl }))
						}
					/>
					<FileUploadCard
						label='Selfie com o documento'
						hint='Segura o documento ao lado do rosto'
						variant='selfie'
						purpose='verification-selfie'
						value={verificationForm.selfieUrl}
						onChange={(selfieUrl) =>
							setVerificationForm((f) => ({ ...f, selfieUrl }))
						}
					/>
				</div>

				<div className='flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
					<div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white'>
						<CheckCircle2 className='size-4' aria-hidden />
					</div>
					<p className='text-sm leading-relaxed text-emerald-950'>
						Os documentos são confidenciais e só servem para
						verificar a tua identidade. Sem aprovação da equipa, a
						loja não fica pública no painel.
					</p>
				</div>

				{error && (
					<p
						role='alert'
						className='rounded-xl border border-destructive/25 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive'
					>
						{error}
					</p>
				)}
			</OnboardingShell>
		)
	}

	return (
		<div className='flex flex-1 flex-col items-center justify-center bg-background px-4 py-12'>
			<div className='w-full max-w-md space-y-8 text-center'>
				<div className='mx-auto flex size-20 items-center justify-center rounded-full bg-secondary/10 sm:size-24'>
					<Clock
						className='size-10 text-secondary sm:size-12'
						aria-hidden
					/>
				</div>

				<div className='space-y-3'>
					<p className='text-sm font-medium text-muted-foreground'>
						Pedido enviado
					</p>
					<h1 className='font-heading text-2xl font-bold tracking-tight text-balance sm:text-3xl'>
						A tua loja está em revisão
					</h1>
					<p className='text-sm leading-relaxed text-muted-foreground sm:text-base'>
						A equipe Zuka vai confirmar os teus dados. Recebes uma
						notificação quando fores aprovado, até lá podes
						continuar a explorar o marketplace.
					</p>
				</div>

				<div className='space-y-2'>
					<Button
						render={
							<Link
								href='/'
								onClick={() => setViewAsBuyerMode()}
							/>
						}
						className='h-12 w-full rounded-full text-base font-semibold'
						size='lg'
					>
						Ir para o marketplace
					</Button>
					<p className='text-xs text-muted-foreground'>
						O painel do vendedor fica disponível após aprovação.
					</p>
				</div>
			</div>
		</div>
	)
}
