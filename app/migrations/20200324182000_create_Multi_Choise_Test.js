exports.up = async knex => {
  return knex.schema.createTable('MultiChoice', table => {
    table.increments('id');
    table.string('title').notNullable();
    table.string('subtitle').notNullable();
    table.json('answers').notNullable();
    table
      .integer('topic_id')
      .references('Topics.id')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = knex => {
  return knex.schema.dropTable('MultiChoice');
};
