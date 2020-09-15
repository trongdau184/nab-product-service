import ProductRepository from "../../api/product/ProductRepository";
import IProductService from "../../api/product/IProductService";
import HttpClient from "../../core/utils/HttpClient";

import iocContainer from "../../api/config/IocConfig";
import TYPES from "../../api/common/Types";

describe("Product Service", () => {
  const product1 = {
    "_id": "5f5647aa3d0589a5313773aa",
    "name": "A1",
    "price": 100,
    "brand": "Samsung",
    "color": "black",
    "createdAt": "2020-09-07T14:46:02.169Z",
    "updatedAt": "2020-09-07T14:46:02.169Z"
  };

  const product2 = {
    "_id": "5f5647aa3d0589a5313773aa",
    "name": "A1",
    "price": 100,
    "brand": "Samsung",
    "color": "black",
    "createdAt": "2020-09-07T14:46:02.169Z",
    "updatedAt": "2020-09-07T14:46:02.169Z"
  };

  beforeEach(() => {
    
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Get a product", async () => {
  
    const mockFunc = jest.fn();
    ProductRepository.prototype.findById = mockFunc;

    mockFunc.mockReturnValue(product1);
    HttpClient.post = jest.fn();

    let service: IProductService = iocContainer.get<IProductService>(TYPES.IProductService);
    let result = await service.getById("5f5647aa3d0589a5313773aa");
    console.log(JSON.stringify(result));
    
    expect(result).not.toBeNull();
  });

  test("Create a product", async() => {
    const mockFunc = jest.fn();
    ProductRepository.prototype.create = mockFunc;
    mockFunc.mockReturnValue(product1);
    const payload = {
      "name": "A1",
      "price": 100,
      "brand": "Samsung",
      "color": "black",
      "createdAt": "2020-09-07T14:46:02.169Z",
      "updatedAt": "2020-09-07T14:46:02.169Z"
    }

    let service: IProductService = iocContainer.get<IProductService>(TYPES.IProductService);
    let result = await service.create(payload);

    expect(result).not.toBeNull();
  });

  test("Update a product", async() => {
    const mockFunc = jest.fn();
    ProductRepository.prototype.findByIdAndUpdate = mockFunc;
    mockFunc.mockReturnValue(product1);
    const payload = {
      "name": "A1",
      "price": 100,
      "brand": "Samsung",
      "color": "black",
      "createdAt": "2020-09-07T14:46:02.169Z",
      "updatedAt": "2020-09-07T14:46:02.169Z"
    }

    let service: IProductService = iocContainer.get<IProductService>(TYPES.IProductService);
    let result = await service.update("5f5647aa3d0589a5313773aa", payload);

    expect(result).not.toBeNull();
  });

  test("Delete a product", async() => {
    const mockFunc = jest.fn();
    ProductRepository.prototype.deleteById = mockFunc;
    mockFunc.mockReturnValue(product1);

    let service: IProductService = iocContainer.get<IProductService>(TYPES.IProductService);

    let result = await service.delete("5f5647aa3d0589a5313773aa");
    expect(result).not.toBeNull();
  });

  test("Retrieve products", async() => {
    const mockFunc = jest.fn();
    ProductRepository.prototype.retrieve = mockFunc;
    mockFunc.mockReturnValue({items: [product1, product2], count: 2});
    HttpClient.post = jest.fn();

    let service: IProductService = iocContainer.get<IProductService>(TYPES.IProductService);
    let result = await service.retrieve({name: "A1"}, {default: "-1", name: "1"}, 1, 1);

    expect(result).not.toBeNull();
    expect(result.items.length).toEqual(2);
  });
});