exports.up = async knex => {
  return knex.schema.createTable('test_questions', table => {
    table
      .integer('test_id')
      .unsigned()
      .references('id')
      .inTable('tests')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('question_id')
      .unsigned()
      .references('id')
      .inTable('questions')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('test_questions');
};
