import { DB, NotFoundException, Request, Response, response, use } from '@formidablejs/framework'
import { Controller } from './Controller'
import { TweetRepository } from '../../Repositories/TweetRepository'
import { Authentication } from '../../Services/Authentication';
import { StoreTweetRequest } from '../Requests/StoreTweetRequest';

export class ApiController extends Controller {
	/**
	 * Generate a token.
	 */
	async login(request: Request): Promise<Response> {
		return response(await Authentication.generateApiToken(request), 200)
	}

	/**
	 * Show tweets feed.
	 */
	async feed(request: Request): Promise<Response> {
		return response(await TweetRepository.feed(request.query('page', 1), 20), 200)
	}

	/**
	 * Show a specific tweet.
	 */
	async show(request: Request): Promise<Response> {
		const tweet = await TweetRepository
			.join('users', 'tweets.user_id', '=', 'users.id')
			.select(
				'tweets.*',
				'users.name as user_name',
				'users.username as user_username',
				'users.email as user_email'
			)
			.where('snowflake_id', request.param('snowflake_id'))
			.first()

		if (!tweet) {
			throw new NotFoundException('Tweet not found')
		}

		return response(tweet, 200)
	}

	/**
	 * Show user's tweets/timeline.
	 */
	async timeline(request: Request): Promise<Response> {
		const user = await DB.table('users').where('username', request.param('username')).first()

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return response(await TweetRepository.timeline(user, request.query('page', 1), 20), 200)
	}

	/**
	 * Store a new tweet.
	 */
	@use(StoreTweetRequest)
	async store(request: StoreTweetRequest): Promise<Response> {
		const tweet = await request.persist()

		return response(tweet, 201)
	}
}
