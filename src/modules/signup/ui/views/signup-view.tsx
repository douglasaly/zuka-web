'use client'

import { useSignupFlow } from '../../hooks/use-signup-flow'
import { SignupBuyerFormSection } from '../sections/signup-buyer-form-section'
import { SignupBuyerWelcomeSection } from '../sections/signup-buyer-welcome-section'
import { SignupRoleSection } from '../sections/signup-role-section'
import { SignupSellerAccountSection } from '../sections/signup-seller-account-section'
import { SignupSellerPendingSection } from '../sections/signup-seller-pending-section'
import { SignupSellerProfileSection } from '../sections/signup-seller-profile-section'
import { SignupSellerVerificationSection } from '../sections/signup-seller-verification-section'

export function SignupView() {
	const flow = useSignupFlow()

	if (flow.step === 'role') {
		return (
			<SignupRoleSection
				onSelectBuyer={() => flow.setStep('buyer-form')}
				onSelectSeller={() => flow.setStep('seller-1')}
			/>
		)
	}

	if (flow.step === 'buyer-form') {
		return (
			<SignupBuyerFormSection
				form={flow.buyerForm}
				onChange={(patch) =>
					flow.setBuyerForm((f) => ({ ...f, ...patch }))
				}
				loading={flow.loading}
				error={flow.error}
				onBack={() => flow.goBack('role')}
				onContinue={flow.handleBuyerContinue}
			/>
		)
	}

	if (flow.step === 'buyer-welcome') {
		return <SignupBuyerWelcomeSection />
	}

	if (flow.step === 'seller-1') {
		return (
			<SignupSellerAccountSection
				form={flow.s1}
				onChange={(patch) => flow.setS1((f) => ({ ...f, ...patch }))}
				provinces={flow.provinces}
				categories={flow.categories}
				locationLoading={flow.locationLoading}
				locationError={flow.locationError}
				onRequestLocation={flow.requestCurrentLocation}
				loading={flow.loading}
				error={flow.error}
				onBack={() => flow.goBack('role')}
				onContinue={flow.handleSellerStep1}
			/>
		)
	}

	if (flow.step === 'seller-2') {
		return (
			<SignupSellerProfileSection
				form={flow.s2}
				onChange={(patch) => flow.setS2((f) => ({ ...f, ...patch }))}
				loading={flow.loading}
				error={flow.error}
				onBack={() => flow.goBack('seller-1')}
				onContinue={flow.handleSellerStep2}
			/>
		)
	}

	if (flow.step === 'seller-3') {
		return (
			<SignupSellerVerificationSection
				form={flow.s3}
				onChange={(patch) => flow.setS3((f) => ({ ...f, ...patch }))}
				loading={flow.loading}
				error={flow.error}
				onBack={() => flow.goBack('seller-2')}
				onSubmit={flow.handleSellerStep3}
			/>
		)
	}

	return <SignupSellerPendingSection />
}
