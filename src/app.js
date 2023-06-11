const express = require('express');
const env = require('./app/config/env');

const indexRoute = require('./app/routes/index');
const usersRoute = require('./app/routes/users');

const app = express();

app.use(express.json());

app.use('/', indexRoute);
app.use('/users', usersRoute);

const network = env.network;
const appInfo = env.app;
app.listen(network.port, network.host, () => {
  console.log(`Server of ${appInfo.name} listening on port ${network.port}`);
});
