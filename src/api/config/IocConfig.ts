import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "../common/Types";
import IProductService from "../product/IProductService";
import ProductService from "../product/ProductService"
import IUserService from "../user/IUserService";
import UserService from "../user/UserService"
import IProductController from "../product/IProductController";
import ProductController from "../product/ProductController"
import IUserController from "../user/IUserController";
import UserController from "../user/UserController";
import IProductRepository from "../product/IProductRepository";
import ProductRepository from "../product/ProductRepository";

let container = new Container();
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository)
container.bind<IProductService>(TYPES.IProductService).to(ProductService);
container.bind<IProductController>(TYPES.IProductController).to(ProductController);
container.bind<IUserService>(TYPES.IUserService).to(UserService);
container.bind<IUserController>(TYPES.IUserController).to(UserController);

export default container;