exports.up = async knex => {
  return knex.schema.createTable('questions', table => {
    table.increments('id');
    table
      .integer('topic_id')
      .references('topics.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('questions');
};
