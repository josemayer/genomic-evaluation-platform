const env = process.env;

const environment = {
  network: {
    host: env.APP_HOST || 'localhost',
    port: env.APP_PORT || 3000,
  },
  app: {
    name: env.APP_NAME || 'API',
    version: env.APP_VERSION || '1.0.0',
    jwtSecret: env.APP_JWT_SECRET || 'secret',
  },
  dbs: {
    postgres: {
      host: env.POSTGRES_HOST || 'postgres',
      port: env.POSTGRES_PORT || 5432,
      database: env.POSTGRES_DB || 'postgres',
      users: {
        postgres: {
          user: env.POSTGRES_ROOT_USER || 'postgres',
          password: env.POSTGRES_ROOT_PASSWORD || 'postgres',
        },
        user: {
          user: env.POSTGRES_USER_USER || 'usuario',
          password: env.POSTGRES_USER_PASSWORD || 'userpass',
        },
        system: {
          user: env.POSTGRES_SYSTEM_USER || 'system',
          password: env.POSTGRES_SYSTEM_PASSWORD || 'syspass',
        },
      }
    },
    redis: {
      url: `redis://${env.REDIS_USERNAME || 'default'}:${env.REDIS_PASSWORD || ''}@${env.REDIS_HOST || 'redis'}:${env.REDIS_PORT || '6379'}`
    },
    neo4j: {
      host: "neo4j://" + (env.NEO4J_HOST || "neo4j"),
      user: env.NEO4J_USER || "neo4j",
      password: env.NEO4J_PASSWORD || "password",
    }
  },
};

module.exports = environment;
