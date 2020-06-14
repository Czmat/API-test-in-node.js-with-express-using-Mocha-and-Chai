const Joi = require('joi');

const taskSchema = {
  name: Joi.string().min(3).required(),
  completed: Joi.boolean(),
};

const validateTask = (task) => Joi.validate(task, taskSchema);

module.exports = {
  validateTask,
};
