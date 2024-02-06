import { Snowflake } from "@theinternetfolks/snowflake";
import { DB, Mail, Request, ValidationException, config } from '@formidablejs/framework'
import { TweetRepository } from '../../Repositories/TweetRepository'

export class StoreTweetRequest extends Request {
	/**
	 * @inheritDoc
	 */
	authorize(): boolean {
		return this.auth().check()
	}

	/**
	 * @inheritDoc
	 */
	rules(): any {
		return {
			tweet: 'required|string|max:280'
		}
	}

	/**
	 * Get mentions from the tweet.
	 */
	private async mentions(): Promise<User[]> {
		const mentions = this.input('tweet').match(/@(\w+)/g) || []

		const users = await Promise.all(mentions.map((mention: string) => {
			return DB.table('users').where('username', mention.slice(1)).first()
		}))

		users.forEach((user, index) => {
			if (!user) {
				throw ValidationException.withMessages({
					tweet: [`User ${mentions[index]} does not exist`]
				})
			}
		})

		return users
	}

	/**
	 * Persist the tweet to the database.
	 */
	async persist(): Promise<Tweet> {
		const mentions = await this.mentions()

		const tweet = await TweetRepository.create<Tweet>({
			snowflake_id: Snowflake.generate(),
			user_id: this.auth().user().id,
			content: this.input('tweet')
		})

		await Promise.all(mentions.map((user: any) => this.mention(user, tweet)))

		return tweet
	}

	/**
	 * Send email notifications to mentioned users and persist mentions to the database.
	 */
	async mention(user: User, tweet: Tweet) {
		const url = `${config('app.client_url')}/tweet/${tweet.snowflake_id}`

		Mail.to(user.email)
			.subject('You have been mentioned in a tweet')
			.raw(`${this.auth().user().name} mentioned you in a tweet. View the tweet here: ${url}`);

		return DB.table('mentions').insert({
			user_id: user.id,
			tweet_id: tweet.id
		})
	}
}
