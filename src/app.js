const express = require('express');
const env = require('./app/config/env');

const indexRoute = require('./app/routes/index');
const helloWorldRoute = require('./app/routes/helloWorld');
const examsRoute = require('./app/routes/exams');

const app = express();

app.use('/', indexRoute);
app.use('/helloWorld', helloWorldRoute);
app.use('/exams', examsRoute);

const network = env.network;
const appInfo = env.app;
app.listen(network.port, network.host, () => {
  console.log(`Server of ${appInfo.name} listening on port ${network.port}`);
});
