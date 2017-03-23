import Joi from 'joi';

const updatePassword = Joi.object().keys({
  username: Joi.string().regex(/^[a-zA-Z0-9]\w+$/).min(3).max(20).required(),
  password: Joi.string().regex(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.).*$/).min(8).max(20).required(),
  newPass: Joi.string().regex(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.).*$/).min(8).max(20).required(),
  key: Joi.string().required(),
});

export default updatePassword;
