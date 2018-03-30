const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const compress = require('compression');

const routes = require('./routes/index');
const users = require('./routes/user');
const chat = require('./routes/chat');
const static = require('./routes/static');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';


// view engine setup

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: ['views/partials/'],
  helpers: {
    block: function(name, options) {
      var blocks = this._blocks,
        content = blocks && blocks[name];
      return content ? content.join('\n') : null;
    },
    contentFor: function(name, options) {
      var blocks = this._blocks || (this._blocks = {}),
        block = blocks[name] || (blocks[name] = []);
      block.push(options.fn(this));
    },
  },

}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(compress());
// app.use(express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static(path.join(__dirname, 'public')));
// app.use('/static', express.static(path.join(__dirname, 'node_modules')));

app.use('/', routes);
app.use('/users', users);
app.use('/chat', chat);
app.use('/static', static);

// /catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error',
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error',
  });
});

module.exports = app;
