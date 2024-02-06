const { Database } = require('@formidablejs/framework');

/** @param {Database} DB */
exports.up = (DB) => {
	return DB.schema.createTable('tweets', (table) => {
		table.increments('id').primary();
		table.text('snowflake_id').unique().primary();
		table.integer('user_id').unsigned().index();
		table.text('content');
		table.timestamps(true, true);

		// foreigns
		table.foreign('user_id').references('id').inTable('users');
	});
};

/** @param {Database} DB */
exports.down = (DB) => DB.schema.dropTable('tweets');
