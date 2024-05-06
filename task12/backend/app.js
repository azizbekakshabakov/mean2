var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const atlasCreds = require('./atlasCreds');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();
const cors = require('cors');

const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://adminUser:${encodeURIComponent(atlasCreds.password)}@atlascluster.zhkoeux.mongodb.net/?retryWrites=true&w=majority`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// БЕЗОПАСНЫЕ ЗАГОЛОВКИ X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
app.use(helmet());

app.use('/task/', indexRouter);
app.use('/auth/', authRouter);

// app.use((err, req, res, next) => {
//   if (err.code !== 'EBADCSRFTOKEN') return next(err);

//   // CSRF token error
//   res.status(403).send('CSRF token invalid');
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// const privateKey = fs.readFileSync('./private.key', 'utf8');
// const certificate = fs.readFileSync('./certificate.crt', 'utf8');

// // Создаем объект сервера HTTPS
// const httpsServer = https.createServer({ key: privateKey, cert: certificate }, app);

// // Запускаем сервер на порте 443 (стандартный порт HTTPS)
// httpsServer.listen(443, () => {
//     console.log('HTTPS Server running on port 443');
// });


module.exports = app;
