exports.up = async knex => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  return knex.schema.createTable('temp_users', table => {
    table.uuid('token').defaultTo(knex.raw('uuid_generate_v4()'));
    table.return('token');
  });
};

exports.down = knex => {
  return knex.schema.dropTable('temp_users');
};
