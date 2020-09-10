import * as Joi from '@hapi/joi';

export const loginValidator = Joi.object({
    email: Joi.string().trim().email().required().description("Email"),
    password: Joi.string().trim().required()
}).label("Login");