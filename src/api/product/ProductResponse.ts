import * as Joi from '@hapi/joi';

export const ProductDetail = Joi.object({
    id: Joi.string().description('Product Id'),
    name: Joi.string().description('Product Name'),
    price: Joi.number().description('Price'),
    brand: Joi.string().description('Branch'),
    color: Joi.string().description('Color'),
    category: Joi.string().description('Category'),
}).label('Product Detail');

export const ProductList = Joi.object({
    items: Joi.array().items(ProductDetail).description("List of products"),
    count: Joi.number().description("Numbers of items")
}).label("Product List");