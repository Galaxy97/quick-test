exports.up = async knex => {
  return knex.schema.createTable('tests', table => {
    table.increments('id');
    table
      .integer('lecturer_id')
      .references('lecturers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('code').notNullable();
    table.boolean('is_open').notNullable();
    table.boolean('funny_message').defaultTo(false);
    table.unique('code');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('tests');
};
