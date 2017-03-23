import Joi from 'joi';

const registerSchema = Joi.object().keys({
  username: Joi.string().regex(/^[a-zA-Z0-9]\w+$/).min(3).max(20).required(),
  firstname: Joi.string().regex(/^[a-zA-Z-]*$/).min(3).max(40).required(),
  lastname: Joi.string().regex(/^[a-zA-Z-]*$/).min(3).max(40).required(),
  email: Joi.string().regex(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).required(),
  password: Joi.string().regex(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.).*$/).min(8).max(20).required(),
  confirm: Joi.string().regex(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.).*$/).min(8).max(20).required(),
  image: Joi.any().optional(),
  language: Joi.string(),
});

export default registerSchema;
