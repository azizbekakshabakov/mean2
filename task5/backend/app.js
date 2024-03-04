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

app.set('port', 3001);

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// wss.on('connection', function connection(ws) {
//   console.log('New WebSocket connection!!!');
//   ws.on('message', function incoming(message) {
//     console.log('Received message: %s', message);

//     ws.send(message);
//   })
// });

// const PORT = 5000;
// server.listen(PORT, () => {
//   console.log("MY SERVER IS RUN");
// });

const mongoose = require("mongoose");
const { handleConnection } = require('./socket/eventHandlers');
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

// ЛОГИРОВАНИЕ ГЛОБАЛЬНОЕ МИДЛВЕЙР
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`Логирование идет: ip адрес ${req.ip}, статус запроса ${res.statusCode}, тип запроса ${req.method},  ${new Date().toISOString()}`);
  });
  next();
});

// РАЗРЕШЕНИЕ ЗАПРОСОВ С LOCALHOST
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept');

  next();
});

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

io.on('connection', (socket) => {
  handleConnection(socket, io);
});
// io.on('connection', (socket) => {
//   console.log('Client connected');

//   socket.on('message', (message) => {
//     console.log(`Received message: ${message}`);
//     // Broadcast received message to all clients
//     io.emit('message', message);
//   });
    
//     // Emit data to the connected socket user(s)
//   socket.emit('data', 'asdf');
//   // });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   socket.on('aziz', () => {
//     // const tasks = Task.find({});
//     // console.log(tasks);

//     console.log('Client охуел');
//     io.emit('bek', '123');
//   });
// });

server.listen(3001);

module.exports = app;
