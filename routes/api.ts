import { Request } from '@formidablejs/framework'
import { Route } from '@formidablejs/framework'
import { ApiController } from '../app/Http/Controllers/ApiController'

/**
 * --------------------------------------------------------------------------
 * API Routes
 * --------------------------------------------------------------------------
 *
 * Here is where you can register API routes for your application. These
 * routes are loaded by the RouteServiceResolver within a group which
 * is assigned the "jwt" middleware group.
 */

Route.post('/login', [ApiController, 'login']).middleware(['guest'])

Route.get('/user', (request: Request) => request.auth().user()).middleware(['auth'])

Route.group({ prefix: 'tweets' }, () => {
	Route.get('/', [ApiController, 'feed'])
	Route.get('/:snowflake_id', [ApiController, 'show'])
	Route.get('/@:username', [ApiController, 'timeline'])
	Route.put('/', [ApiController, 'store']).middleware(['auth'])
})
