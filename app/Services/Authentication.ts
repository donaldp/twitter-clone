import { Hash, type Request, ValidationException, Redirect, DB, PersonalAccessToken, Auth } from "@formidablejs/framework";
import { UserRepository } from "../Repositories/UserRepository";
import { asObject, without } from "@formidablejs/framework/lib/Support/Helpers";
import crypto from "crypto";

export class Authentication {
	/**
	 * Replace default login rules as we want to allow
	 * users to login with their username's instead of email
	 * if they want to.
	 */
	static async beforeLogin(request: Request) {
		request.setRules({
			username: 'required|string',
			password: 'required|string'
		})
	}

	/**
	 * Replace default register rules because we want to
	 * add a username field to the registration form.
	 */
	static async beforeRegister(request: Request) {
		request.setRules({
			name: 'required|string',
			email: 'required|email',
			username: 'required|string|alpha_dash|min:3',
			password: 'required|string|min:6'
		})

		const [ [emailTaken], [usernameTaken] ] = await Promise.all([
			UserRepository.where('email', request.input('email')).count(),
			UserRepository.where('username', request.input('username')).count()
		])

		const errors: RegistrationErrors = {}

		if (emailTaken > 0) {
			errors.email = ['Email already in use']
		}

		if (usernameTaken > 0) {
			errors.username = ['Username already in use']
		}

		if (Object.keys(errors).length > 0) {
			throw ValidationException.withMessages(errors)
		}
	}

	/**
	 * Insert a new user into the users table.
	 */
	static async createUser(request: Request) {
		return UserRepository.create({
			name: request.input('name'),
			email: request.input('email'),
			username: request.input('username'),
			password: await Hash.make(request.input('password')),
		})
	}

	/**
	 * Redirect the user after they have been authenticated.
	 */
	static onAuthenticated(request: Request) {
		if (request.expectsHtml()) {
			return Redirect.to('/')
		}
	}

	/**
	 * Redirect the user after they have been logged out.
	 */
	static onSessionDestroyed(request: Request) {
		if (request.expectsHtml()) {
			return Redirect.to('/')
		}
	}

	/**
	 * Redirect the user after they have been registered.
	 */
	static onRegistered(request: Request) {
		if (request.expectsHtml()) {
			return Redirect.to('/')
		}
	}

	/**
	 * Add a gravatar to the user object after they have been authenticated.
	 */
	static async onFetchAuthenticated(table: string, id: number): Promise<User> {
		const user = await DB.table(table).where('id', id).first()

		user.gravatar = 'https://www.gravatar.com/avatar/' + crypto.createHash('md5').update(user.email).digest('hex')

		return user
	}

	/**
	 * Generate API token.
	 */
	static async generateApiToken(request: Request): Promise<any> {
		request.validate({
			username: 'required|string',
			password: 'required|string'
		})

		let user = await Auth.attempt(request.body())

		user = asObject(user)

		const token = await PersonalAccessToken.create('auth:jwt', user.id, 'users', ['*'], null, {
			protocol: 'api',
			ip_address: request.ip() || null,
			user_agent: request.header('user-agent', null)
		})

		return {
			token: token,
			type: 'Bearer',
			user: without(user, [
				'id',
				'password',
				'remember_token'
			])
		}
	}
}
