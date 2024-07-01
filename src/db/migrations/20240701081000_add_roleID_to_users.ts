exports.up = function (knex) {
  return knex.schema.table('users', function (table) {
    table
      .integer('roleID')
      .unsigned()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('roleID');
  });
};
