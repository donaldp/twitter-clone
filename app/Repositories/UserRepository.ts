import { Repository } from '@formidablejs/framework'

export class UserRepository extends Repository {
	/**
     * Context reference.
     */
    static get context(): string {
        return 'UserRepository'
    }

	/**
	 * The table associated with the repsitory.
	 */
	get tableName(): string {
		return 'users'
	}

	/**
	 * @inheritdoc
	 */
	get hidden(): string[] {
		return [
			'id',
			'password',
			'remember_token',
		]
	}
}
