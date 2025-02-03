const Joi = require('joi');

const pongSchema = Joi.object({
  pong: Joi.number()
    .required()
    .valid(1)
    .messages({
      'any.required': 'Pong value is required',
      'number.base': 'Pong must be a number',
      'any.only': 'Pong value must be 1'
    })
});