const http = require('http');
const path = require('path');
const debug = require('debug');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('express-hbs');

const log = debug('botkit:webserver');

module.exports = controller => {
  const webserver = express();

  webserver.use((req, res, next) => {
    req.rawBody = '';

    req.on('data', chunk => {
      req.rawBody += chunk;
    });

    next();
  });

  webserver.use(cookieParser());
  webserver.use(bodyParser.json());
  webserver.use(bodyParser.urlencoded({
    extended: true
  }));

  // NOTE: set up handlebars ready for tabs
  webserver.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, '/../views/partials')
  }));

  webserver.set('view engine', 'hbs');
  webserver.set('views', path.join(__dirname, '/../views/'));

  // NOTE: import express middlewares that are present in /components/express-middleware
  let normalizedPath = require('path').join(__dirname, 'express-middleware');
  require('fs').readdirSync(normalizedPath).forEach(file => {
    require(`./express-middleware/${file}`)(webserver, controller);
  });

  webserver.use(express.static('public'));

  const server = http.createServer(webserver);
  server.listen(process.env.PORT || 3000, null, () => {
    log('Express webserver configured and listening at http://localhost:', process.env.PORT || 3000);
  });

  // NOTE: import all the pre-defined routes that are present in /components/routes
  normalizedPath = require('path').join(__dirname, 'routes');
  require('fs').readdirSync(normalizedPath).forEach(file => {
    require(`./routes/${file}`)(webserver, controller);
  });

  controller.webserver = webserver;
  controller.httpserver = server;

  return webserver;
};
