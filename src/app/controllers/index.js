function showRoutes(req, res, next) {
  res.json({
    message: 'Welcome, master database guys! Use the routes below to view examples of the API.',
    routes: [
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
      {
        method: 'POST',
        path: '/users/client/new',
        description: 'Creates a new client in the database.',
      },
    ],
  });
}

module.exports = {
  showRoutes,
};
