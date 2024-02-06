import { Inertia, InertiaResponse } from '@formidablejs/inertia'
import { Controller } from './Controller'

export class AuthController extends Controller {
	/**
	 * Show the login page.
	 */
	login(): InertiaResponse {
		return Inertia.render('Auth/Login')
	}

	/**
	 * Show the registration page.
	 */
	register(): InertiaResponse {
		return Inertia.render('Auth/Register')
	}
}
