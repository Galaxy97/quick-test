exports.up = async knex => {
  return knex.schema.createTable('subjects', table => {
    table.increments('id');
    table.string('title').notNullable();
    table
      .integer('course_id')
      .references('courses.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('subjects');
};
