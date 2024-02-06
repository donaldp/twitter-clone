import { Repository } from '@formidablejs/framework'
import { PaginationResults } from '@formidablejs/framework/types/Database/Repository';

export class TweetRepository extends Repository {
	/**
	 * The table associated with the repsitory.
	 */
	get tableName(): string {
		return 'tweets'
	}

    /**
     * Context reference.
     */
    static get context(): string {
        return 'TweetRepository'
    }

	/**
	 * Get the user's timeline.
	 */
	static timeline(user: User, page: number = 1, max: number = 10): Promise<PaginationResults> {
		return this
			.join('users', 'tweets.user_id', '=', 'users.id')
			.where('tweets.user_id', user.id)
			.orWhere(function (query) {
				query.whereIn('tweets.id', function (q) {
					q.select('tweet_id').from('mentions').where('user_id', user.id);
				});
			})
			.select(
				'tweets.*',
				'users.name as user_name',
				'users.username as user_username',
				'users.email as user_email'
			)
			.orderBy('tweets.created_at', 'desc')
			.pagination({
				page: page,
				pageSize: max,
			})
	}

	/**
	 * Get feed for guests and authenticated users.
	 */
	static feed(page: number = 1, max: number = 10): Promise<PaginationResults> {
		return this
			.join('users', 'tweets.user_id', '=', 'users.id')
			.select(
				'tweets.*',
				'users.name as user_name',
				'users.username as user_username',
				'users.email as user_email'
			)
			.orderBy('tweets.created_at', 'desc')
			.pagination({
				page: page,
				pageSize: max,
			})
	}
}
