exports.up = async knex => {
  return knex.schema.createTable('motivation_phrases', table => {
    table.string('phrase').notNullable();
  });
};

exports.down = knex => {
  return knex.schema.dropTable('motivation_phrases');
};
