import Joi from 'joi';

export const pongSchema = Joi.object({
  pong: Joi.number().required().valid(1) 
});
