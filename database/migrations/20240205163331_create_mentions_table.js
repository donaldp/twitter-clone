const { Database } = require('@formidablejs/framework');

/** @param {Database} DB */
exports.up = (DB) => {
	return DB.schema.createTable('mentions', (table) => {
		table.increments('id').primary();
		table.bigInteger('tweet_id').unsigned().index();
		table.bigInteger('user_id').unsigned().index();
		table.timestamps(true, true);

		// foreigns
		table.foreign('tweet_id').references('id').inTable('tweets');
		table.foreign('user_id').references('id').inTable('users');
	});
};

/** @param {Database} DB */
exports.down = (DB) => DB.schema.dropTable('mentions');
