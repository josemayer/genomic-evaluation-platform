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
        path: '/users/clients',
        description: 'Returns a list of clients from the database.',
      },
      {
        method: 'GET',
        path: '/users/client/{id}',
        description: 'Returns a client from the database by id.',
      },
    ],
  });
}

module.exports = {
  showRoutes,
};
