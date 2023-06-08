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
    redis: {
      // NOTE(luatil): Format `redis[s]://[[username][:password]@][host][:port][/db-number]`
      // NOTE(luatil): env.REDIS_HOST should be the the name of the container, as defined in the .yml file.
      url: `redis://${env.REDIS_USERNAME || 'default'}:${env.REDIS_PASSWORD || ''}@${env.REDIS_HOST || 'redis'}:${env.REDIS_PORT || '6379'}`
    }
  },
};

module.exports = environment;
