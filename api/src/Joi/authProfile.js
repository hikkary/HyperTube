import Joi from 'joi';

const AuthProfileSchema = Joi.object().keys({
  id: Joi.string().alphanum(),
  currentLanguage: Joi.string().allow(''),
});

export default AuthProfileSchema;
