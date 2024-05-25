// sign_in_provider
const roles = [
  {
    display_name: 'Admin',
    role_slug: 'admin',
    role_type: 'ADMIN',
  },
  {
    display_name: 'User',
    role_slug: 'user',
    role_type: 'USER',
  },
];

exports.up = async function (knex) {
  await knex.schema
    .createTable('role', (table) => {
      table
        .uuid('public_id')
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string('display_name').notNull();
      table.string('role_slug').notNull();
      table.enum('role_type', ['ADMIN', 'USER']);
    })
    .createTable('user', (table) => {
      table
        .uuid('public_id')
        .primary()
        .defaultTo(knex.raw('gen_random_uuid()'));
      table.string('name').notNull();
      table.string('phone_number').notNull();
      table.text('bio').notNull();
      table.string('email').notNull().unique();
      table.text('token').unique();
      table.text('profile_photo');
      table.enum('profile_type', ['public', 'private']).defaultTo('private');
      table
        .uuid('role_id')
        .references('public_id')
        .inTable('role')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.timestamps(true, true);
    });

  await knex('role').insert(roles);
  const adminRole = await knex('role').select().where('role_type', 'ADMIN');

  await knex('user').insert({
    name: 'admin',
    bio: 'i am admin',
    email: 'admin@gmail.com',
    role_id: adminRole[0]?.public_id,
    profile_type: 'private',
    phone_number: '9214355567',
  })
};

exports.down = async function (knex) {
  await knex.schema.dropTable('user');
  await knex.schema.dropTable('role');
};
