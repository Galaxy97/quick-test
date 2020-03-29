exports.up = async knex => {
  return knex.schema.createTable('test_results', table => {
    table.increments('id');
    table
      .integer('test_id')
      .references('tests.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('telegram_id')
      .references('participants.telegram_id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('question_id')
      .references('questions.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.json('participant_answers').notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTable('test_results');
};
