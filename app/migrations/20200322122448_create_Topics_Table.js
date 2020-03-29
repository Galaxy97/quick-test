exports.up = async knex => {
  return knex.schema.createTable('topics', table => {
    table.increments('id');
    table.string('title').notNullable();
    table
      .integer('subject_id')
      .references('subjects.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('topics');
};
