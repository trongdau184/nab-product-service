# Product Service with NodeJS-Hapi

Product Service provides REST APIs for Products

**Installation**
```bash
npm install
```
**Run**

* Start the service:
```bash
npm start
```
The service runs on URL: http://localhost:5000

* Test:
```bash
npm test
```

**Features**
* Product APIs: Create, Update, Retrieve and Search Products, Get Product Detail and Delete Product
    * Retrieve and Search Product API:
        * Support search on any fields of the product
        * Advance search: The search product API not only supports "equal" operator but also other searching operators. The Search Operator supported as listed as below:

            | Search Operator   | Description   |
            | ----------------- | ----------    |
            | eq                | equals        |
            | lt                | litter than   |
            | lte               | little than or equal  |
            | gt                | greater than  |
            | gte               | greater than or equal |
            | ne                | not equal     |
            | startswith        | starts with a text    |
            | nstartswith       | not start with a text |
            | contains          | contains a text       |
            | ncontains         | not contain a text    |
            | endswith          | ends with a text      |
            | nendswith         | not end with a text   |
            | isempty           | is empty          |
            | isnempty          | is not empty      |
            | in                | item is in a given array  |
            | nin               | item is not in a given array  |
            | range             | field is a given range (date, number) |

        To specify the advance search on a field, the client puts the the query param with format: {field__operator}={value} to the query string
        For ex: if the client would like to get the products which have price greater than or equals 1,000,000, the client can add "price__gte=1000000" to the query string.
        * Sort: Client is able to specify the sort field and sort type (ASC|DESC) with format: {fieldname}:{asc|desc} in the query string.

* User API: for demonstration purpose, the service provides the login API which returns the JWT token (not validate given username/input). The token then will be used in Authorization Header in the Request to protected APIs.

* API documenentation url: http://localhost:5000/documentation

**Sequence diagram**
* Search sequence diagram

![Search product sequence diagram](https://github.com/trongdau184/nab-product-service/blob/master/Search%20Product%20Diagram.png?raw=true)

* View product sequence diagram

![View product sequence diagram](https://github.com/trongdau184/nab-product-service/blob/master/View-product-diagram.png?raw=true)

**Code folder structure**
```
├── api
│   ├── common
│   ├── config
│   ├── product
│   └── user
├── configurations
│   ├── config.dev.json
│   ├── config.test.json
│   └── index.ts
├── core
│   ├── common
│   │   ├── Constants.ts
│   │   └── Validators.ts
│   ├── controller
│   │   └── IBaseController.ts
│   ├── repositories
│   │   ├── BaseRepository.ts
│   │   ├── DataAccess.ts
│   │   ├── IBaseDocument.ts
│   │   ├── IBaseRepository.ts
│   │   └── SearchQueryConverter.ts
│   ├── services
│   │   ├── BaseService.ts
│   │   └── IBaseService.ts
│   └── utils
├── index.ts
├── plugins
├── server.ts
└── test
```

**Software development principles, pattern & practices**
* 3 Layers Pattern: Controler - Service - Repository
* Inversion of control: make components loose coupling
* Highly reusable: Quickly to add new Rest API for resource with basic CRUD: Developer just needs to create route file, define the new Controller, create new Service class which extends BaseService, create new Repository class which extends BaseRepository, and need validators, DTOs
* SOLID, KISS

**Frameworks & Libraries**
* Hapi: NodeJS API framework
* Boom: Generate Htpp friendly error objects
* Good: Hapi process monitoring
* hapi-auth-jwt2: hapi authentication plugin uses JWT token
* Joi: request payload or model validation
* inversify: Inversion of control (IOC) container.
* axios: send http request
* mongoose: ODM for MongoDB 
* lodash: JavaScript utility library
* hapi-swagger: API Documentation.
* jest: unit test framework

**DB Schema**
Product
| Field     | Data Type |
| ----------| ----------|
| name      | string    |
| price     | number    |
| color     | string    |
| brand     | string    |
| category  | string    |

**Curl commands to verify APIs**
* Login to get the token
```bash
curl -X POST "http://localhost:5000/users/login" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{  \"email\": \"test@gmail.com\",  \"password\": \"123456\"}"
```
* Create product
Call login API first to get the token, then set it to the "authorization" in the header.
```bash
curl -X POST "http://localhost:5000/products" -H  "accept: application/json" -H  "authorization: token" -H  "Content-Type: application/json" -d "{  \"name\": \"M20\",  \"price\": 5000000,  \"brand\": \"Samsung\",  \"color\": \"Black\",  \"category\": \"Phone\"}"
```
* Update product
Call login API first to get the token, then set it to the "authorization" in the header.
```bash
curl -X PUT "http://localhost:5000/products/5f619302f56b8419e5e45548" -H  "accept: application/json" -H  "authorization: token" -H  "Content-Type: application/json" -d "{  \"name\": \"M20\",  \"price\": 5200000,  \"brand\": \"Samsung\",  \"color\": \"Black & White\",  \"category\": \"Phone\"}"
```

* Get Product by Id
Call login API first to get the token, then set it to the "authorization" in the header.
```bash
curl -X GET "http://localhost:5000/products/5f619302f56b8419e5e45548" -H  "accept: application/json" -H  "authorization: token"
```

* Retrieve and Search Product
Call login API first to get the token, then set it to the "authorization" in the header.
```bash
curl -X GET "http://localhost:5000/products?name__startswith=A&price__gte=100&page=1&pageSize=1&sortBy=name%3Aasc" -H  "accept: application/json" -H  "authorization: token"
```

* Delete product
Call login API first to get the token, then set it to the "authorization" in the header.
```bash
curl -X DELETE "http://localhost:5000/products/5f619302f56b8419e5e45548" -H  "accept: application/json" -H  "authorization: token"
```

**Improvements**

The User login/authenticate API should be separated to the Identity Service
