const Joi = require('joi');

const userSchema = Joi.object({
  fullname: Joi.string().required(),
  email: Joi.string().email().required(),
  pseudo: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]{8,}$/))
    .message(
      'Password should be at least 08 characters, with upper,lower and digits'
    )
    .required(),
  provider: Joi.string(),
});

module.exports = { userSchema };
