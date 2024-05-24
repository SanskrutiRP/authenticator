import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

module.exports = {
  client: 'postgresql',
  connection: `postgres://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  seeds: {
    directory: './seeds',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
};
