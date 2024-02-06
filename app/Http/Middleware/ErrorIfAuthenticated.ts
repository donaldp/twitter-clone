import { ErrorIfAuthenticated as Middleware, Redirect, Request, die } from '@formidablejs/framework'

export class ErrorIfAuthenticated extends Middleware {
	/**
	 * Redirect the user if they are authenticated.
	 */
	onAuthenticated(request: Request) {
		if (request.expectsHtml()) {
			die(() => Redirect.to('/'))
		}

		// else, the framework will handle the response.
	}
}
