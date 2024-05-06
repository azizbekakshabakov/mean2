var express = require('express');
var router = express.Router();
const {Task, validate} = require('../schemas/task');
const authMiddleware = require('../middleware/auth');

// const csrf = require('csurf');
// const csrfProtection = csrf({ cookie: true });

router.get('/csrf', (req, res) => {
  const csrfToken = req.csrfToken();

  res.send({ csrfToken });
});

router.post("/", authMiddleware, async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const task = await Task(req.body).save();
  res.status(201).send({ data: task, message: "Задача создана" });
});

router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find();
  // res.cookie('XSRF-TOKEN', req.csrfToken());
  res.status(200).send({ data: tasks });
});

router.get("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id });
  res.status(200).send({ data: task });
});

router.put("/:id", authMiddleware, async (req, res) => {
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
