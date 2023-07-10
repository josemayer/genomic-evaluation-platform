const express = require('express');
const env = require('./app/config/env');

const indexRoute = require('./app/routes/index');
const redisRoute = require('./app/routes/redis');
const examsRoute = require('./app/routes/exams');
const samplesRoute = require('./app/routes/samples');
const notificationsRoute = require('./app/routes/notifications');
const usersRoute = require('./app/routes/users');
const neo4jRoute = require('./app/routes/neo4j.js');
const conditionsRoutes = require('./app/routes/conditions');

const app = express();

app.use(express.json());

app.use('/', indexRoute);
app.use('/redis', redisRoute);
app.use('/exams', examsRoute);
app.use('/samples', samplesRoute);
app.use('/notifications', notificationsRoute);
app.use('/users', usersRoute);
app.use('/neo4j', neo4jRoute);
app.use('/conditions', conditionsRoutes);

const network = env.network;
const appInfo = env.app;
app.listen(network.port, network.host, () => {
  console.log(`Server of ${appInfo.name} listening on port ${network.port}`);
});
