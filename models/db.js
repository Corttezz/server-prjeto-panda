const { Pool } = require('pg');
const pool = new Pool({
  user: 'danielcortez@projeto-panda',
  host: 'projeto-panda.postgres.database.azure.com',
  database: 'users',
  password: 'panda@321',
  port: 5432,
});

module.exports = pool;
