import "reflect-metadata";
import { injectable, inject } from "inversify";
import { BaseService } from "../../core/services/BaseService";
import TYPES from "../common/Types";
import IProductRepository from "./IProductRepository";
import IProductService from "./IProductService";

@injectable()
export default class ProductService extends BaseService implements IProductService {

    constructor(@inject(TYPES.IProductRepository) repository: IProductRepository) {
        super(repository);
    }

    public async retrieve(filter?: any, sortBy?: any, page?: number, pageSize?: number) {
        if (!sortBy) {
            sortBy = {default: "-1", name: "1"};
        }
        return this.repository.retrieve({page: page, pageSize: pageSize, filter: filter, sortBy: sortBy});
    }
}