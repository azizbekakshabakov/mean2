const {Task, validate} = require('../schemas/task');
const crypto = require('crypto');

function handleConnection(socket, io) {
  console.log('New socket connected');

  // Define event listeners for the socket
  socket.on('message', handleMessage);
  socket.on('disconnect', handleDisconnect);
  socket.on('tasks', (data) => handleGetTasks(data, io));
  socket.on('set-task', (data) => handlePushTask(data, io));
  socket.on('delete-task', (data) => handleDeleteTask(data, io));
  socket.on('update-task', (data) => handleUpdateTask(data, io));
  socket.on('task', (data) => handleGetTask(data, io));
}

function handleMessage(data, io) {
  console.log('Message received:', data);
  // Process the message
}

function handleDisconnect() {
  console.log('Socket disconnected');
}

async function handleGetTasks(data, io) {
  const tasks = await Task.find();
  
  const encryptionKey = crypto.scryptSync('mySecretEncryptionKey', 'salt', 32);
  const iv = Buffer.from('1234567890123456', 'utf8');
  try {
    for (let task of tasks) {
      const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
      let decryptedDescription = decipher.update(task.description, 'hex', 'utf8');
      decryptedDescription += decipher.final('utf8');
      task.description = decryptedDescription.replace(/^"(.*)"$/, '$1');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send('Decryption failed');
  }

  io.emit('tasks', tasks);
}

async function handlePushTask(data, io) {
  const encryptionKey = crypto.scryptSync('mySecretEncryptionKey', 'salt', 32);
  const iv = Buffer.from('1234567890123456', 'utf8');
  
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encryptedData = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  data = encryptedData;

  const task = await Task({description: data}).save();

  handleGetTasks(data, io);
}

async function handleDeleteTask(data, io) {
  await Task.findByIdAndDelete(data);

  handleGetTasks(data, io);
}

async function handleUpdateTask(data, io) {
  const obj = JSON.parse(data);

  const encryptionKey = crypto.scryptSync('mySecretEncryptionKey', 'salt', 32);
  const iv = Buffer.from('1234567890123456', 'utf8');
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encryptedData = cipher.update(JSON.stringify(obj.description), 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  obj.description = encryptedData;

  const task = await Task.findByIdAndUpdate(obj._id, obj, {
    new: true,
  });
  
  handleGetTasks(data, io);
}

async function handleGetTask(data, io) {
  const task = await Task.findOne({ _id: data });
  
  const encryptionKey = crypto.scryptSync('mySecretEncryptionKey', 'salt', 32);
  const iv = Buffer.from('1234567890123456', 'utf8');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let decryptedDescription = decipher.update(task.description, 'hex', 'utf8');
  decryptedDescription += decipher.final('utf8');
  task.description = decryptedDescription.replace(/^"(.*)"$/, '$1');

  io.emit('task', task);
}

module.exports = {
  handleConnection
};
