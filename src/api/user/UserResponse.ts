import * as Joi from '@hapi/joi';

export const Token = Joi.object({
    token: Joi.string().description('JWT Token')
}).label("JWT Token");