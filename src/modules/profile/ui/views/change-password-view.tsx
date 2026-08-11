'use client'

import { useChangePassword } from '../../hooks/use-change-password'
import { ChangePasswordForm } from '../sections/change-password-form'
import { ChangePasswordHeader } from '../sections/change-password-header'

export const ChangePasswordView = () => {
	const p = useChangePassword()

	return (
		<div className='mx-auto max-w-2xl px-4 py-8 md:py-12'>
			<ChangePasswordHeader />

			<ChangePasswordForm
				currentPassword={p.currentPassword}
				newPassword={p.newPassword}
				confirmPassword={p.confirmPassword}
				loading={p.loading}
				showCurrent={p.showCurrent}
				showNew={p.showNew}
				passwordRequirements={p.passwordRequirements}
				onCurrentChange={p.setCurrentPassword}
				onNewChange={p.setNewPassword}
				onConfirmChange={p.setConfirmPassword}
				onToggleCurrent={() => p.setShowCurrent(!p.showCurrent)}
				onToggleNew={() => p.setShowNew(!p.showNew)}
				onSubmit={p.handleSubmit}
				onCancel={() => p.router.push('/perfil/definicoes')}
			/>
		</div>
	)
}
