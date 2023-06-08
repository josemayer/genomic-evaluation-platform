function showRoutes(req, res, next) {
  res.json({
    message: 'Welcome, master database guys! Use the routes below to view examples of the API.',
    routes: [
      {
        method: 'GET',
        path: '/helloWorld',
        description: 'Returns a simple hello-world message.',
      },
      {
        method: 'GET',
        path: '/helloWorld/env',
        description: 'Returns a simple hello-world message with environment config variables.',
      },
      {
        method: 'GET',
        path: '/helloWorld/name/{any name}',
        description: 'Returns a simple hello-world message with the name provided.',
      },
      {
        method: 'GET',
        path: '/helloWorld/postgres',
        description: 'Returns a simple hello-world message with the names retrieved from a Postgres database.',
      },
      {
        method: 'GET',
        path: '/redis/get/{key}',
        description: 'Returns the value of the given key from redis'
      },
      {
        method: 'GET',
        path: '/redis/set/{key}/{value}',
        description: 'Sets the value of the key on redis'
      },
    ],
  });
}

module.exports = {
  showRoutes,
};
