const {User} = require('../schemas/user');
const {Task, validate} = require('../schemas/task');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

function handleConnection(socket, io) {
  console.log('сокет подключен');

  // Define event listeners for the socket
  // socket.on('message', handleMessage);
  socket.on('disconnect', handleDisconnect);

  // аутентификация регистрация
  socket.on('register', (data) => handleCreateUser(data, io));
  socket.on('auth', (data) => handleAuth(data, io));

  // tasks
  socket.on('tasks', (data) => handleGetTasks(data, io));
  socket.on('set-task', (data) => handlePushTask(data, io));
  socket.on('delete-task', (data) => handleDeleteTask(data, io));
  socket.on('update-task', (data) => handleUpdateTask(data, io));
  socket.on('task', (data) => handleGetTask(data, io));
}

// function handleMessage(data, io) {
//   console.log('получено сообщ', data);
// }

function handleDisconnect() {
  console.log('сокет отключен');
}


async function handleCreateUser(data, io) {
  // Check if user exists
  const isBusy = await User.findOne({ email: data.email });
  if (isBusy) {
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(data.password, salt);

  // Create user
  const user = await User.create({
    email: data.email,
    password: newPassword,
  });
}

async function handleAuth(data, io) {
  // Check if user exists
  const user = await User.findOne({ email: data.email });
  if (!user) {
    return;
  }
  if (user && bcrypt.compareSync(data.password, user.password)) {
    io.emit('token', generateToken(user._id));
  }
}


async function handleGetTasks(data, io) {
  const tasks = await Task.find();

  io.emit('tasks', tasks);
}

async function handlePushTask(data, io) {
  data.created_at = new Date();
  data.updated_at = data.created_at;

  await Task(data).save();

  handleGetTasks(data, io);
}

async function handleDeleteTask(data, io) {
  await Task.findByIdAndDelete(data);

  handleGetTasks(data, io);
}

async function handleUpdateTask(data, io) {
  data.updated_at = new Date();

  const task = await Task.findByIdAndUpdate(data._id, data, {
    new: true,
  });
  
  handleGetTasks(data, io);
}

async function handleGetTask(data, io) {
  const task = await Task.findOne({ _id: data });

  io.emit('task', task);
}


//Generate JWT for the user
const generateToken = (id) => {
  return jwt.sign({ id }, "qwerty", {
    expiresIn: "7d",
  });
};

module.exports = {
  handleConnection
};