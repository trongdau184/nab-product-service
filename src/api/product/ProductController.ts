import * as Hapi from "hapi";
import * as Boom from "@hapi/boom";
import "reflect-metadata";
import { injectable, inject } from "inversify";
import CreateProductDto from "./CreateProductDto";
import ProductService from "./ProductService";
import UpdateProductDto from "./UpdateProductDto";
import IProductService from "./IProductService";
import TYPES from "../common/Types";
import IProductController from "./IProductController";

@injectable()
export default class ProductController implements IProductController {
    private service: IProductService;

    constructor(@inject(TYPES.IProductService) service: IProductService) {
        this.service = service;
    }

    public async create(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        let product: CreateProductDto = <CreateProductDto>request.payload;
        try {
            let result = await this.service.create(product);
            return h.response(result).code(201);
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }

    public async update(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        let id = request.params.id;
        let product: UpdateProductDto = <UpdateProductDto>request.payload;
        try {
            let result = await this.service.update(id, product);
            return h.response(result).code(200);
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }

    public async delete(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        let id = request.params.id;
        try {
            let result = await this.service.delete(id);
            if (result) {
                return h.response(result).code(200);
            } else {
                return Boom.notFound();
            }
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }

    public async getById(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        let id = request.params.id;
        let result = await this.service.getById(id);
        if(result) {
            return result;
        } else {
            return Boom.notFound();
        }
    }

    public async retrieve(request: Hapi.Request, h: Hapi.ResponseToolkit) {
        try {
            let result = await this.service.retrieve(request.query.filter, request.query.sortBy, 
                request.query.paging["page"], request.query.paging["pageSize"]);
            return result;
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }
}