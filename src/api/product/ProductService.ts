import "reflect-metadata";
import { injectable, inject } from "inversify";
import { BaseService } from "../../core/services/BaseService";
import TYPES from "../common/Types";
import IProductRepository from "./IProductRepository";
import IProductService from "./IProductService";
import * as Configs from "../../configurations";
import HttpClient from "../../core/utils/HttpClient";
import FilterParser = require("../../core/utils/FilterParser");

@injectable()
export default class ProductService extends BaseService implements IProductService {

    constructor(@inject(TYPES.IProductRepository) repository: IProductRepository) {
        super(repository);
        
    }

    public async retrieve(filter?: any, sortBy?: any, page?: number, pageSize?: number) {
        if (!sortBy) {
            sortBy = {default: "-1", name: "1"};
        }
        let filterCriteria = null;
        if (filter) {
            filterCriteria = FilterParser.parse(filter);
        }
        let result = await this.repository.retrieve({page: page, pageSize: pageSize, filter: filter, sortBy: sortBy});
        if (filterCriteria) {
            // Call Analytics Service to record search product
            const serviceConfig = Configs.getServiceConfigs();
            let analyticsServiceURI = serviceConfig["analyticsServiceURI"];
            let searchProductPayload = {
                filters: filterCriteria,
                searchAt: new Date().toISOString()
            }
            try {
                let recordSearchProductResult = await HttpClient.post(analyticsServiceURI, "/analytics/recordSearchProduct", searchProductPayload, {auth: true})
                .catch((err) => {
                    console.log(JSON.stringify(err));
                })
            } catch (error) {
                console.log(JSON.stringify(error));
            }
        }
        return result;
    }

    public async getById(id: string) {
        let product = await this.repository.findById(id);
        // Call Analytics Service to record view product
        const serviceConfigs = Configs.getServiceConfigs();
        let analyticsServiceURI = serviceConfigs["analyticsServiceURI"];
        let viewProductPayload = {
            productId: id,
            viewAt: new Date().toISOString()
        }
        try {
            let recordViewProductResult = await HttpClient.post(analyticsServiceURI, "/analytics/recordViewProduct", viewProductPayload, {auth: true});
        } catch (error) {
            console.log(JSON.stringify(error));
        }
        return product;
    }
}