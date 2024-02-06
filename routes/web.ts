import { Route } from '@formidablejs/framework'
import { AuthController } from '../app/Http/Controllers/AuthController'
import { TweetController } from '../app/Http/Controllers/TweetController'

/**
 * --------------------------------------------------------------------------
 * Web Routes
 * --------------------------------------------------------------------------
 *
 * Here is where you can register web routes for your application. These
 * routes are loaded by the RouteServiceResolver within a group which
 * is assigned the "session" middleware group.
 */

Route.group({ middleware: 'guest' }, () => {
	Route.get('/login', [AuthController, 'login']).name('show.login')
	Route.get('/register', [AuthController, 'register']).name('show.register')
});

Route.get('/', [TweetController, 'index']).name('home')
Route.post('/tweet', [TweetController, 'store']).name('tweet.store')
Route.get('/@:username', [TweetController, 'timeline']).name('user.tweets')
Route.get('/tweet/:snowflake_id', [TweetController, 'show']).name('tweet.show')
