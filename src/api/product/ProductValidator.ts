import * as Joi from '@hapi/joi';

export const createProductValidator = Joi.object({
    name: Joi.string().required().description('Product Name'),
    price: Joi.number().required().min(0).description('Price'),
    brand: Joi.string().required().description('Brand'),
    color: Joi.string().description('Color'),
    category: Joi.string().required().description('Category'),
}).label('Create Product');

export const updateProductValidator = Joi.object({
    name: Joi.string().optional().description('Product Name'),
    price: Joi.number().min(0).optional().description('Price'),
    brand: Joi.string().optional().description('Brand'),
    color: Joi.string().optional().description('Color'),
    category: Joi.string().optional().description('Category'),
}).label('Update Product');