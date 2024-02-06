import { Controller } from './Controller'
import { StoreTweetRequest } from '../Requests/StoreTweetRequest'
import { DB, NotFoundException, Request, use } from '@formidablejs/framework'
import { Inertia, InertiaRedirect, InertiaResponse } from '@formidablejs/inertia'
import { without } from '@formidablejs/framework/lib/Support/Helpers'
import { TweetRepository } from '../../Repositories/TweetRepository'

export class TweetController extends Controller {
	/**
	 * Show tweets feed.
	 */
	async index(request: Request): Promise<InertiaResponse> {
		return Inertia.render('Tweets/Feed', {
			user: request.auth().check()
				? without(request.auth().user(), [
					'id',
					'password',
					'remember_token'
				])
				: null,
			tweets: await TweetRepository.feed(request.query('page', 1))
		})
	}

	/**
	 * Show user's tweets/timeline.
	 */
	async timeline(request: Request): Promise<InertiaResponse> {
		const user = await DB.table('users').where('username', request.param('username')).first()

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return Inertia.render('Tweets/Timeline', {
			user: request.auth().check()
				? without(request.auth().user(), [
					'id',
					'password',
					'remember_token'
				])
				: null,
			tweets_by: user,
			tweets: await TweetRepository.timeline(user, request.query('page', 1))
		})
	}

	/**
	 * Store a new tweet.
	 */
	@use(StoreTweetRequest)
	async store(request: StoreTweetRequest): Promise<InertiaRedirect> {
		await request.persist()

		return Inertia.back()
	}

	/**
	 * Show a specific tweet.
	 */
	async show(request: Request): Promise<InertiaResponse> {
		return Inertia.render('Tweets/Show', {
			user: request.auth().check()
				? without(request.auth().user(), [
					'id',
					'password',
					'remember_token'
				])
				: null,
			tweet: await TweetRepository
				.join('users', 'tweets.user_id', '=', 'users.id')
				.where('snowflake_id', request.param('snowflake_id'))
				.select(
					'tweets.*',
					'users.name as user_name',
					'users.username as user_username',
					'users.email as user_email'
				)
				.first()
		})
	}
}
