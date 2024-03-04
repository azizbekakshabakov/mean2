const mongoose = require("mongoose");
const joi = require("joi");

const taskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  created_at: { type: String },
  done: { type: Boolean, default: false }
});

const validate = (task) => {
  const schema = joi.object({
    description: joi.string().required(),
    created_at: joi.string()
  });
  return schema.validate(task);
};

const Task = mongoose.model("task", taskSchema);

module.exports = { Task, validate };