exports.up = async knex => {
  return knex.schema.createTable('multi_choice', table => {
    table
      .integer('question_id')
      .references('questions.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .primary();
    table.string('title').notNullable();
    table.string('subtitle').notNullable();
    table.json('answers').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('multi_choice');
};
