exports.up = async knex => {
  return knex.schema.createTable('courses', table => {
    table.increments('id');
    table.string('title').notNullable();
    table.string('description').notNullable();
    table.float('color_top').notNullable();
    table.float('color_bottom').notNullable();
    table
      .integer('lecturer_id')
      .references('lecturers.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('courses');
};
