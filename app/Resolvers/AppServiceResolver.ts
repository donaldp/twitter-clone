import { AuthService as Auth } from '@formidablejs/framework'
import { ServiceResolver } from '@formidablejs/framework'
import { ResetPassword } from '../Mail/ResetPassword'
import { VerifyEmail } from '../Mail/VerifyEmail'
import { Authentication } from '../Services/Authentication'

export class AppServiceResolver extends ServiceResolver {
	boot(): AppServiceResolver {
		this.app.server({
			ignoreTrailingSlash: true,
			trustProxy: true
		})

		/** Register the mailers */
		Auth.verificationMailer(VerifyEmail)
		Auth.resetPasswordMailer(ResetPassword)

		Auth.verificationMailerEvents({
			onError: (reason) => console.error(reason)
		})

		/** Register the authentication service (optional) */
		Auth.beforeLogin(Authentication.beforeLogin)
		Auth.beforeRegister(Authentication.beforeRegister)
		Auth.onCreateUser(Authentication.createUser)
		Auth.onAuthenticated(Authentication.onAuthenticated)
		Auth.onSessionDestroyed(Authentication.onSessionDestroyed)
		Auth.onFetchAuthenticated(Authentication.onFetchAuthenticated)
		Auth.onRegistered(Authentication.onRegistered)

		return this
	}
}
