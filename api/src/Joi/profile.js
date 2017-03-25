import Joi from 'joi';

const ProfileSchema = Joi.object().keys({
  id: Joi.string().alphanum(),
  username: Joi.string().regex(/^[a-zA-Z0-9]\w+$/).min(3).max(20).required(),
  firstname: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/).min(3).max(40).required(),
  lastname: Joi.string().regex(/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/).min(3).max(40).required(),
  email: Joi.string().regex(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).required(),
  image: Joi.any().optional(),
  language: Joi.string(),
});

export default ProfileSchema;
