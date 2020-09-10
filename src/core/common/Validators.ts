import * as Joi from '@hapi/joi';

export const jwtValidator = Joi.object({'authorization': Joi.string().required()}).unknown();