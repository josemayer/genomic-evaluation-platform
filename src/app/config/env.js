const env = process.env;

const environment = {
  network: {
    host: env.APP_HOST || 'localhost',
    port: env.APP_PORT || 3000,
  },
  app: {
    name: env.APP_NAME || 'API',
    version: env.APP_VERSION || '1.0.0',
  },
  dbs: {
    postgres: {
      host: env.POSTGRES_HOST || 'postgres',
      port: env.POSTGRES_PORT || 5432,
      user: env.POSTGRES_USER || 'postgres',
      password: env.POSTGRES_PASSWORD || 'postgres',
      database: env.POSTGRES_DB || 'postgres',
    },
  },
};

module.exports = environment;
