const express = require('express');
const env = require('./app/config/env');

const helloWorldRoute = require('./app/routes/helloWorld');

const app = express();

app.use('/helloWorld', helloWorldRoute);

const network = env.network;
const appInfo = env.app;
app.listen(network.port, network.host, () => {
  console.log(`Server of ${appInfo.name} listening on port ${network.port}`);
});
