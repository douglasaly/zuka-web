'use client'

import { useSellerOnboarding } from '../../hooks/use-seller-onboarding'
import { SellerOnboardingAccountSection } from '../sections/seller-onboarding-account-section'
import { SellerOnboardingGates } from '../sections/seller-onboarding-gates'
import { SellerOnboardingPendingSection } from '../sections/seller-onboarding-pending-section'
import { SellerOnboardingProfileSection } from '../sections/seller-onboarding-profile-section'
import { SellerOnboardingVerificationSection } from '../sections/seller-onboarding-verification-section'

export const SellerOnboardingView = () => {
	const onboarding = useSellerOnboarding()

	if (
		onboarding.isUnauthenticated ||
		onboarding.isGateLoading ||
		onboarding.roleBootstrapError ||
		onboarding.isPreparingSeller
	) {
		return (
			<SellerOnboardingGates
				isUnauthenticated={onboarding.isUnauthenticated}
				isLoading={onboarding.isGateLoading}
				roleBootstrapError={onboarding.roleBootstrapError}
				isPreparingSeller={onboarding.isPreparingSeller}
				onRetryRoleBootstrap={onboarding.retryRoleBootstrap}
			/>
		)
	}

	if (onboarding.shouldRedirectToDashboard) {
		onboarding.redirectToDashboard()
		return null
	}

	if (onboarding.step === 1) {
		return (
			<SellerOnboardingAccountSection
				form={onboarding.accountForm}
				onChange={(patch) =>
					onboarding.setAccountForm((f) => ({ ...f, ...patch }))
				}
				provinces={onboarding.provinces}
				categories={onboarding.categories}
				emailError={onboarding.emailError}
				phoneError={onboarding.phoneError}
				error={onboarding.error}
				isPending={onboarding.isPending}
				canContinue={onboarding.canContinueStep1}
				onBack={onboarding.goBackToMarketplace}
				onContinue={onboarding.handleCreateStore}
			/>
		)
	}

	if (onboarding.step === 2) {
		return (
			<SellerOnboardingProfileSection
				form={onboarding.profileForm}
				onChange={(patch) =>
					onboarding.setProfileForm((f) => ({ ...f, ...patch }))
				}
				descriptionError={onboarding.descriptionError}
				deliveryError={onboarding.deliveryError}
				whatsappError={onboarding.whatsappError}
				callPhoneError={onboarding.callPhoneError}
				error={onboarding.error}
				isPending={onboarding.isPending}
				canContinue={onboarding.canContinueStep2}
				onBack={() => onboarding.setStep(1)}
				onContinue={onboarding.handleUpdateStore}
			/>
		)
	}

	if (onboarding.step === 3) {
		return (
			<SellerOnboardingVerificationSection
				form={onboarding.verificationForm}
				onChange={(patch) =>
					onboarding.setVerificationForm((f) => ({ ...f, ...patch }))
				}
				error={onboarding.error}
				isPending={onboarding.isPending}
				onBack={() => onboarding.setStep(2)}
				onSubmit={onboarding.handleSubmitVerification}
			/>
		)
	}

	return <SellerOnboardingPendingSection />
}
