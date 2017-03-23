import Joi from 'joi';

const forgotPassword = Joi.object().keys({
  username: Joi.string().regex(/^[a-zA-Z0-9]\w+$/).min(3).max(20).required(),
});

export default forgotPassword;
