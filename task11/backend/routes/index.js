var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const {Task, validate} = require('../schemas/task');
const {authMiddleware, createdTimeMiddleware, encryptMiddleware} = require('../middleware/main');

router.post("/", [authMiddleware, createdTimeMiddleware, encryptMiddleware], async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    console.log(error.details[0].message);
    res.status(400).send({ message: error.details[0].message });
    return;
  }

  const task = await Task(req.body).save();
  res.status(201).send({ data: task, message: "Задача создана" });
});

router.get("/", [authMiddleware], async (req, res) => {
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
    // next();
  } catch (error) {
    console.log(error);
    return res.status(500).send('Decryption failed');
  }

  res.status(200).send({ data: tasks });
});

router.get("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });
  res.status(200).send({ data: task });
});

router.put("/:id", [authMiddleware, encryptMiddleware], async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: task, message: "Обновлена задача" });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Задача удалена" });
});

module.exports = router;
