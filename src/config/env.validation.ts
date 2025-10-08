import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'prod').default('development'),
  DB_PORT:Joi.number().port().default(5432),
  DB_HOST:Joi.string().required(),
  DB_NAME:Joi.string().required(),
  DB_USERNAME:Joi.string().required(),
  DB_PASSWORD:Joi.string().required(),
  SECRET_KEY:Joi.string().required(),
  
});
 