(function () {
  'use strict';

  const express = require('express');

  const app = express();
  const config = {
    appName: 'ponkpoker',
    port: process.env.PORT || 80,
  };
  const sourceDir = __dirname + '/build';

  // Health check endpoint for load balancer
  app.get('/healthz', function (req, res) {
    res.set('Content-Type', 'text/plain');
    res.send('OK');
  });

  app.use(express.static(sourceDir));
  app.set('views', sourceDir);
  app.set('view engine', 'html');

  app.get('/', function (req, res) {
    res.render('index.html');
  });

  app.all('/*', function (req, res) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: sourceDir });
  });

  app.listen(config.port);
  // eslint-disable-next-line no-console
  console.log(config.appName + ' running on port: ' + config.port);
})();
