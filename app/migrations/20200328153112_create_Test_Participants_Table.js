exports.up = async knex => {
  return knex.schema.createTable('test_participants', table => {
    table
      .integer('test_id')
      .unsigned()
      .references('id')
      .inTable('tests')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table
      .integer('telegram_id')
      .unsigned()
      .references('telegram_id')
      .inTable('participants')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('test_participants');
};
