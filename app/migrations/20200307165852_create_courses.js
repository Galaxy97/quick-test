exports.up = async knex => {
  return knex.schema.createTable('Courses', table => {
    table.increments('id');
    table.string('title').notNullable();
    table.integer('lecturer_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('lecturer_id').references('Lecturers.id');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('Courses');
};
