import Joi from 'joi';

const commentSchema = Joi.object().keys({
  comment: Joi.string().regex(/^[a-zA-Z0-9 ]+$/).min(3).max(140).required(),
});

export default commentSchema;
