exports.up = async knex => {
  return knex.schema.createTable('participants', table => {
    table
      .integer('telegram_id')
      .notNullable()
      .primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('participants');
};
