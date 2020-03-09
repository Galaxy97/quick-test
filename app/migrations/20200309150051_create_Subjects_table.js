exports.up = async knex => {
  return knex.schema.createTable('Subjects', table => {
    table.increments('id');
    table.string('title').notNullable();
    table.integer('courses_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.foreign('courses_id').references('Courses.id');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('Courses');
};
