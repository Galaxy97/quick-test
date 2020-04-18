exports.up = async knex => {
  return knex.schema.createTable('test_lecturers', table => {
    table
      .integer('test_id')
      .references('tests.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('socket_id').notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTable('test_lecturers');
};
