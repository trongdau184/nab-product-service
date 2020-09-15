import * as Hapi from "hapi";
import * as Joi from '@hapi/joi';
import iocContainer from "../config/IocConfig";
import IProductController from "./IProductController";
import TYPES from "../common/Types";
import * as ProductValidator from "./ProductValidator";
import * as ProductResponse from "./ProductResponse";
import * as Validators from "../../core/common/Validators"

export default function (
  server: Hapi.Server,
) {
  const productController = iocContainer.get<IProductController>(TYPES.IProductController);
  server.bind(productController);

  server.route({
    method: "GET",
    path: "/products/{id}",
    options: {
      handler: productController.getById,
      auth: "jwt",
      tags: ["api", "products"],
      description: "Get product by id.",
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        headers: Validators.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Product founded.",
              schema: ProductResponse.ProductDetail,
            },
            "404": {
              description: "Product does not exists."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "GET",
    path: "/products",
    options: {
      handler: productController.retrieve,
      auth: "jwt",
      tags: ["api", "products"],
      description: "Retrieve products",
      validate: {
        query: Joi.object({
          name: Joi.string().optional(),
          price: Joi.number().optional(),
          brand: Joi.string().optional(),
          color: Joi.string().optional(),
          category: Joi.string().optional(),
          page: Joi.number().optional(),
          pageSize: Joi.number().optional(),
          sortBy: Joi.string().optional()
        }).unknown(),
        headers: Validators.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "List of Products",
              schema: ProductResponse.ProductList
            }
          }
        },
        queryParser: {
          enabled: true
        }
      }
    }
  });

  server.route({
    method: "POST",
    path: "/products",
    options: {
      handler: productController.create,
      auth: "jwt",
      tags: ["api", "products"],
      description: "Create a product.",
      validate: {
        payload: ProductValidator.createProductValidator,
        headers: Validators.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "201": {
              description: "Created product.",
              schema: ProductResponse.ProductDetail,
            }
          }
        }
      }
    }
  });

  server.route({
    method: "PUT",
    path: "/products/{id}",
    options: {
      handler: productController.update,
      auth: "jwt",
      tags: ["api", "products"],
      description: "Update product by id.",
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        payload: ProductValidator.updateProductValidator,
        headers: Validators.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Update product.",
              schema: ProductResponse.ProductDetail
            },
            "404": {
              description: "Product does not exists."
            }
          }
        }
      }
    }
  });

  server.route({
    method: "DELETE",
    path: "/products/{id}",
    options: {
      handler: productController.delete,
      auth: "jwt",
      tags: ["api", "products"],
      description: "Delete product by id.",
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        headers: Validators.jwtValidator
      },
      plugins: {
        "hapi-swagger": {
          responses: {
            "200": {
              description: "Deleted product.",
              schema: ProductResponse.ProductDetail
            },
            "404": {
              description: "Product does not exists."
            }
          }
        }
      }
    }
  });
}
