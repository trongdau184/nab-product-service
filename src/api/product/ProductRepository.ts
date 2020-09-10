import "reflect-metadata";
import { injectable, inject } from "inversify";
import { BaseRepository } from "../../core/repositories/BaseRepository";
import { ProductModel } from "./ProductModel";
import IProductRepository from "./IProductRepository";

@injectable()
export default class ProductRepository extends BaseRepository implements IProductRepository {
    constructor() {
        super(ProductModel);
    }
}