var express = require('express');
var router = express.Router();
const {Task, validate} = require('../schemas/task');

router.post("/", async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) res.status(400).send({ message: error.details[0].message });

  const task = await Task(req.body).save();
  res.status(201).send({ data: task, message: "Задача создана" });
});

router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).send({ data: tasks });
});

router.put("/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).send({ data: task, message: "Обновлена задача" });
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Задача удалена" });
});

module.exports = router;
