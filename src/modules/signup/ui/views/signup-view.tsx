'use client'

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import {
	CheckCircle2,
	Clock,
	Eye,
	EyeOff,
	Loader2,
	MapPin,
	MessageCircle,
	ShoppingBag,
	Store,
	Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
	createStore,
	setOnboardingRole,
	submitVerification,
	updateSellerStore,
} from '@/lib/api/marketplace'
import { createAppSession } from '@/lib/firebase/create-session'
import { auth } from '@/lib/firebase/firebase-client'
import { syncUserToBackend } from '@/lib/firebase/sync-user-to-backend'
import { cn } from '@/lib/utils'
import { FileUploadCard } from '@/modules/onboarding/ui/components/file-upload-card'
import {
	OnboardingField,
	OnboardingFormCard,
	onboardingInputClass,
} from '@/modules/onboarding/ui/components/onboarding-form-card'
import { OnboardingShell } from '@/modules/onboarding/ui/components/onboarding-shell'
import { PhoneInput } from '@/modules/onboarding/ui/components/phone-input'

type FlowStep =
	| 'role'
	| 'buyer-form'
	| 'buyer-welcome'
	| 'seller-1'
	| 'seller-2'
	| 'seller-3'
	| 'seller-4'

interface Province {
	id: string
	name: string
}
interface Category {
	id: string
	name: string
}

const buyerFeatures = [
	{
		icon: CheckCircle2,
		iconClass: 'bg-emerald-50 text-emerald-600',
		title: 'Lojas verificadas',
		description:
			'Todas as lojas são verificadas pela nossa equipa para garantir confiança',
	},
	{
		icon: Truck,
		iconClass: 'bg-red-50 text-secondary',
		title: 'Entrega em Maputo',
		description:
			'Entrega ao domicílio disponível em Maputo Cidade, Matola e mais',
	},
	{
		icon: MessageCircle,
		iconClass: 'bg-emerald-50 text-emerald-600',
		title: 'Contacto via WhatsApp',
		description:
			'Fala diretamente com o vendedor pelo WhatsApp para tirar dúvidas',
	},
]

function formatPhone(v: string) {
	const d = v.replace(/\D/g, '')
	return d ? `+258${d}` : ''
}

function getErrorCode(error: unknown): string | null {
	if (error && typeof error === 'object' && 'code' in error) {
		return String((error as { code: string }).code)
	}
	return null
}

function friendlyError(error: unknown) {
	const code = getErrorCode(error)
	const msg = error instanceof Error ? error.message : String(error)

	if (
		code === 'auth/email-already-in-use' ||
		msg.includes('email-already-in-use')
	) {
		return 'Este email já está registado. Usa outro ou entra na tua conta.'
	}
	if (code === 'auth/weak-password' || msg.includes('weak-password')) {
		return 'A senha deve ter pelo menos 6 caracteres.'
	}
	if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
		return 'Endereço de email inválido.'
	}
	if (
		code === 'auth/network-request-failed' ||
		msg.includes('network-request-failed')
	) {
		return 'Não foi possível contactar o servidor de autenticação. Verifica a ligação e tenta novamente.'
	}
	if (code === 'auth/too-many-requests') {
		return 'Demasiadas tentativas. Aguarda um momento e tenta novamente.'
	}
	if (
		msg.includes('Falha ao criar sessão') ||
		msg.includes('Validation failed')
	) {
		return 'Não foi possível concluir o registo. Verifica as credenciais Firebase no servidor e tenta novamente.'
	}

	return msg || 'Erro ao criar conta'
}

export function SignupView() {
	const [step, setStep] = useState<FlowStep>('role')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [showPassword, setShowPassword] = useState(false)

	const [provinces, setProvinces] = useState<Province[]>([])
	const [categories, setCategories] = useState<Category[]>([])

	useEffect(() => {
		fetch('/api/provinces')
			.then((r) => r.json())
			.then((d) => setProvinces(Array.isArray(d) ? d : []))
			.catch(() => {})
		fetch('/api/categories')
			.then((r) => r.json())
			.then((d) => setCategories(Array.isArray(d) ? d : []))
			.catch(() => {})
	}, [])

	// ── Form state ─────────────────────────────────────────────────────────────

	const [buyerForm, setBuyerForm] = useState({
		name: '',
		email: '',
		password: '',
	})

	const [s1, setS1] = useState({
		storeName: '',
		neighborhood: '',
		email: '',
		password: '',
		categoryId: '',
		provinceId: '',
		phone: '',
	})

	const [locationLoading, setLocationLoading] = useState(false)
	const [locationError, setLocationError] = useState<string | null>(null)

	const [s2, setS2] = useState({
		logoUrl: null as string | null,
		bannerUrl: null as string | null,
		description: '',
		hasDelivery: false,
		whatsapp: '',
		phone: '',
	})

	const [s3, setS3] = useState({
		idCardUrl: null as string | null,
		selfieUrl: null as string | null,
	})

	// ── Handlers ───────────────────────────────────────────────────────────────

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
			setError(friendlyError(e))
		} finally {
			setLoading(false)
		}
	}

	async function handleSellerStep1() {
		setLoading(true)
		setError(null)
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
				phone: formatPhone(s1.phone) || undefined,
			})
			setStep('seller-2')
		} catch (e) {
			setError(friendlyError(e))
		} finally {
			setLoading(false)
		}
	}

	async function handleSellerStep2() {
		setLoading(true)
		setError(null)
		try {
			await updateSellerStore({
				logoUrl: s2.logoUrl ?? undefined,
				bannerUrl: s2.bannerUrl ?? undefined,
				description: s2.description || undefined,
				whatsapp: formatPhone(s2.whatsapp) || undefined,
				phone: formatPhone(s2.phone) || undefined,
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

	function useCurrentLocation() {
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
					setS1((f) => ({ ...f, neighborhood: formatted }))
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

	function goBack(to: FlowStep) {
		setStep(to)
		setError(null)
	}

	// ── Role selection ─────────────────────────────────────────────────────────

	if (step === 'role') {
		return (
			<div className='flex flex-1 items-center justify-center px-4 py-12'>
				<div className='w-full max-w-md space-y-8'>
					<div className='space-y-2'>
						<h1 className='font-heading text-xl font-bold'>
							Como queres usar o Zuka?
						</h1>
						<p className='text-sm text-muted-foreground'>
							Escolhe como queres começar
						</p>
					</div>

					<div className='space-y-3'>
						<button
							type='button'
							onClick={() => setStep('buyer-form')}
							className='group w-full text-left'
						>
							<div className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border'>
								<div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50'>
									<ShoppingBag className='size-5 text-secondary' />
								</div>
								<div>
									<p className='font-semibold text-foreground transition-colors group-hover:text-secondary'>
										Quero comprar
									</p>
									<p className='text-sm text-muted-foreground'>
										Descobre produtos e lojas locais em
										Moçambique
									</p>
								</div>
							</div>
						</button>

						<button
							type='button'
							onClick={() => setStep('seller-1')}
							className='group w-full text-left'
						>
							<div className='flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-all duration-200 hover:border-border'>
								<div className='flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50'>
									<Store className='size-5 text-emerald-700' />
								</div>
								<div>
									<p className='font-semibold text-foreground transition-colors group-hover:text-secondary'>
										Tenho uma loja
									</p>
									<p className='text-sm text-muted-foreground'>
										Vende os teus produtos para milhares de
										clientes
									</p>
								</div>
							</div>
						</button>
					</div>

					<p className='text-center text-xs leading-relaxed text-muted-foreground'>
						Ao continuar aceitas os{' '}
						<Link
							href='/termos'
							className='font-semibold text-foreground hover:underline'
						>
							Termos de Uso
						</Link>{' '}
						e a{' '}
						<Link
							href='/privacidade'
							className='font-semibold text-foreground hover:underline'
						>
							Política de Privacidade
						</Link>
					</p>
				</div>
			</div>
		)
	}

	// ── Buyer: account form ────────────────────────────────────────────────────

	if (step === 'buyer-form') {
		const canContinue =
			buyerForm.email.includes('@') && buyerForm.password.length >= 6

		return (
			<OnboardingShell
				title='Criar conta'
				subtitle='Preenche os teus dados para começar a comprar'
				onBack={() => goBack('role')}
				footer={
					<div className='space-y-3'>
						<Button
							type='button'
							className='h-12 w-full rounded-full text-base font-semibold'
							disabled={loading || !canContinue}
							onClick={handleBuyerContinue}
						>
							{loading ? 'A criar conta...' : 'Continuar'}
						</Button>
						<p className='text-center text-sm text-muted-foreground'>
							Já tens conta?{' '}
							<Link
								href='/auth/login'
								className='font-semibold text-foreground hover:underline'
							>
								Entrar
							</Link>
						</p>
					</div>
				}
			>
				<OnboardingFormCard>
					<OnboardingField label='Nome completo'>
						<Input
							type='text'
							value={buyerForm.name}
							onChange={(e) =>
								setBuyerForm((f) => ({
									...f,
									name: e.target.value,
								}))
							}
							placeholder='O teu nome'
							className={onboardingInputClass}
							autoComplete='name'
						/>
					</OnboardingField>

					<OnboardingField label='Email'>
						<Input
							type='email'
							required
							value={buyerForm.email}
							onChange={(e) =>
								setBuyerForm((f) => ({
									...f,
									email: e.target.value,
								}))
							}
							placeholder='exemplo@email.com'
							className={onboardingInputClass}
							autoComplete='email'
						/>
					</OnboardingField>

					<OnboardingField label='Senha'>
						<div className='relative'>
							<Input
								type={showPassword ? 'text' : 'password'}
								required
								minLength={6}
								value={buyerForm.password}
								onChange={(e) =>
									setBuyerForm((f) => ({
										...f,
										password: e.target.value,
									}))
								}
								placeholder='Mínimo 6 caracteres'
								className={cn(onboardingInputClass, 'pr-10')}
								autoComplete='new-password'
							/>
							<button
								type='button'
								tabIndex={-1}
								aria-label={
									showPassword
										? 'Ocultar senha'
										: 'Mostrar senha'
								}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
								onClick={() => setShowPassword((v) => !v)}
							>
								{showPassword ? (
									<EyeOff className='size-4' />
								) : (
									<Eye className='size-4' />
								)}
							</button>
						</div>
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

	// ── Buyer: welcome ─────────────────────────────────────────────────────────

	if (step === 'buyer-welcome') {
		return (
			<div className='flex flex-1 flex-col'>
				<div className='mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6'>
					<div className='mb-10 space-y-4'>
						<div className='flex size-12 items-center justify-center rounded-2xl bg-muted text-lg font-extrabold text-muted-foreground'>
							Z
						</div>
						<h1 className='font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl'>
							Tudo o que precisas,{' '}
							<span className='block'>perto de ti</span>
						</h1>
					</div>

					<div className='space-y-3'>
						{buyerFeatures.map((f) => (
							<div
								key={f.title}
								className='flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-4'
							>
								<div
									className={cn(
										'flex size-11 shrink-0 items-center justify-center rounded-full',
										f.iconClass
									)}
								>
									<f.icon className='size-5' />
								</div>
								<div className='space-y-1'>
									<p className='font-semibold'>{f.title}</p>
									<p className='text-sm leading-relaxed text-muted-foreground'>
										{f.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className='sticky bottom-0 border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6'>
					<div className='mx-auto w-full max-w-lg'>
						<Button
							render={
								<Link href='/feed/explorar'>
									Começar a explorar
								</Link>
							}
							className='h-12 w-full rounded-full text-base font-semibold'
							size='lg'
						/>
					</div>
				</div>
			</div>
		)
	}

	// ── Seller step 1: account + store ─────────────────────────────────────────

	if (step === 'seller-1') {
		const canContinue =
			s1.storeName.trim() &&
			s1.neighborhood.trim() &&
			s1.email.includes('@') &&
			s1.password.length >= 6 &&
			s1.provinceId

		return (
			<OnboardingShell
				title='Criar conta de loja'
				subtitle='Preenche os dados da tua loja'
				currentStep={1}
				onBack={() => goBack('role')}
				footer={
					<div className='space-y-3'>
						<Button
							type='button'
							className='h-12 w-full rounded-full text-base font-semibold'
							disabled={loading || !canContinue}
							onClick={handleSellerStep1}
						>
							{loading ? 'A criar conta...' : 'Continuar'}
						</Button>
						<p className='text-center text-sm text-muted-foreground'>
							Já tens conta?{' '}
							<Link
								href='/auth/login'
								className='font-semibold text-foreground hover:underline'
							>
								Entrar
							</Link>
						</p>
					</div>
				}
			>
				<OnboardingFormCard>
					<OnboardingField label='Nome da loja'>
						<Input
							required
							value={s1.storeName}
							onChange={(e) =>
								setS1((f) => ({
									...f,
									storeName: e.target.value,
								}))
							}
							placeholder='Ex: Loja da Fátima'
							className={onboardingInputClass}
						/>
					</OnboardingField>

					<OnboardingField label='Província'>
						<select
							required
							value={s1.provinceId}
							onChange={(e) =>
								setS1((f) => ({
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

					<div className='space-y-2'>
						<div className='flex items-center justify-between'>
							<label className='text-sm font-semibold'>
								Endereço da loja
							</label>
							<button
								type='button'
								disabled={locationLoading}
								onClick={useCurrentLocation}
								className='inline-flex items-center gap-1 text-xs font-medium text-secondary hover:underline disabled:opacity-60'
							>
								{locationLoading ? (
									<Loader2 className='size-3 animate-spin' />
								) : (
									<MapPin className='size-3' />
								)}
								{locationLoading
									? 'A obter...'
									: 'Usar localização atual'}
							</button>
						</div>
						<Input
							required
							value={s1.neighborhood}
							onChange={(e) =>
								setS1((f) => ({
									...f,
									neighborhood: e.target.value,
								}))
							}
							placeholder='Ex: Av. Eduardo Mondlane, Maputo'
							className={onboardingInputClass}
						/>
						{locationError && (
							<p className='text-xs text-destructive'>
								{locationError}
							</p>
						)}
					</div>

					<OnboardingField label='Email'>
						<Input
							type='email'
							required
							value={s1.email}
							onChange={(e) =>
								setS1((f) => ({ ...f, email: e.target.value }))
							}
							placeholder='exemplo@email.com'
							className={onboardingInputClass}
							autoComplete='email'
						/>
					</OnboardingField>

					<OnboardingField label='Senha'>
						<div className='relative'>
							<Input
								type={showPassword ? 'text' : 'password'}
								required
								minLength={6}
								value={s1.password}
								onChange={(e) =>
									setS1((f) => ({
										...f,
										password: e.target.value,
									}))
								}
								placeholder='Mínimo 8 caracteres'
								className={cn(onboardingInputClass, 'pr-10')}
								autoComplete='new-password'
							/>
							<button
								type='button'
								tabIndex={-1}
								aria-label={
									showPassword
										? 'Ocultar senha'
										: 'Mostrar senha'
								}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
								onClick={() => setShowPassword((v) => !v)}
							>
								{showPassword ? (
									<EyeOff className='size-4' />
								) : (
									<Eye className='size-4' />
								)}
							</button>
						</div>
					</OnboardingField>

					<OnboardingField label='Categoria principal'>
						<select
							value={s1.categoryId}
							onChange={(e) =>
								setS1((f) => ({
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

					<OnboardingField label='Número de telefone'>
						<PhoneInput
							value={s1.phone}
							onChange={(phone) =>
								setS1((f) => ({ ...f, phone }))
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

	// ── Seller step 2: store profile ───────────────────────────────────────────

	if (step === 'seller-2') {
		return (
			<OnboardingShell
				title='Configura a tua loja'
				subtitle='Personaliza o perfil da tua loja'
				currentStep={2}
				onBack={() => goBack('seller-1')}
				footer={
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={loading}
						onClick={handleSellerStep2}
					>
						{loading ? 'A guardar...' : 'Continuar'}
					</Button>
				}
			>
				<OnboardingFormCard>
					<FileUploadCard
						label='Logo da loja'
						hint='Carregar logo circular'
						variant='logo'
						purpose='store-logo'
						value={s2.logoUrl}
						onChange={(v) => setS2((f) => ({ ...f, logoUrl: v }))}
					/>

					<FileUploadCard
						label='Banner da loja'
						hint='Carregar imagem de capa'
						variant='banner'
						purpose='store-banner'
						value={s2.bannerUrl}
						onChange={(v) => setS2((f) => ({ ...f, bannerUrl: v }))}
					/>

					<OnboardingField label='Descrição curta'>
						<Textarea
							value={s2.description}
							onChange={(e) =>
								setS2((f) => ({
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
							checked={s2.hasDelivery}
							onCheckedChange={(v) =>
								setS2((f) => ({ ...f, hasDelivery: v }))
							}
						/>
					</div>

					<OnboardingField label='Número WhatsApp'>
						<PhoneInput
							value={s2.whatsapp}
							onChange={(v) =>
								setS2((f) => ({ ...f, whatsapp: v }))
							}
						/>
					</OnboardingField>

					<OnboardingField
						label='Número para chamadas'
						hint='Número de telefone fixo ou móvel para clientes ligarem'
					>
						<PhoneInput
							value={s2.phone}
							onChange={(v) => setS2((f) => ({ ...f, phone: v }))}
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

	// ── Seller step 3: identity verification ──────────────────────────────────

	if (step === 'seller-3') {
		const canSubmit = Boolean(s3.idCardUrl && s3.selfieUrl)

		return (
			<OnboardingShell
				title='Verificação de identidade'
				subtitle='Precisamos verificar a tua identidade. A tua conta será aprovada em até 24 horas.'
				currentStep={3}
				onBack={() => goBack('seller-2')}
				maxWidth='lg'
				footer={
					<Button
						type='button'
						className='h-12 w-full rounded-full text-base font-semibold'
						disabled={loading || !canSubmit}
						onClick={handleSellerStep3}
					>
						{loading ? 'A enviar...' : 'Enviar para revisão'}
					</Button>
				}
			>
				<div className='grid gap-4 sm:grid-cols-2'>
					<FileUploadCard
						label=''
						hint=''
						variant='document'
						purpose='verification-id'
						value={s3.idCardUrl}
						onChange={(v) => setS3((f) => ({ ...f, idCardUrl: v }))}
					/>
					<FileUploadCard
						label=''
						hint=''
						variant='selfie'
						purpose='verification-selfie'
						value={s3.selfieUrl}
						onChange={(v) => setS3((f) => ({ ...f, selfieUrl: v }))}
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

	// ── Seller step 4: under review ────────────────────────────────────────────

	return (
		<div className='flex flex-1 flex-col items-center justify-center px-4 py-12'>
			<div className='w-full max-w-md space-y-8 text-center'>
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
					render={<Link href='/'>Voltar ao início</Link>}
					variant='outline'
					className='h-12 w-full rounded-full text-base font-semibold'
					size='lg'
				/>
			</div>
		</div>
	)
}
