var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const atlasCreds = require('./atlasCreds');

//WebSocket imports
const http = require('http'); //!!!
const socketIo = require('socket.io');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();
const cors = require('cors');

app.set('port', 3000);

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

app.use('/task/', indexRouter);
app.use('/auth/', authRouter);

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


var server = http.createServer(app);
const io = socketIo(server, {cors: {origin: '*'}});

const { handleConnection } = require('./socket/eventHandlers');

io.on('connection', (socket) => {
  handleConnection(socket, io);
});

server.listen(3000);

module.exports = app;
