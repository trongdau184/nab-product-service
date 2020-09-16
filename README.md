# Product Service with NodeJS-Hapi

Product Service provides REST APIs for Products

**High Level Architecture**

![High Level Architecture diagram](https://github.com/trongdau184/nab-product-service/blob/master/High-level-architect-diagram.png?raw=true)

The micro-services architecture will be applied for E-Commerce system, in this architecture, each features/module are divided into small and independent services which will handle a piece of business module or perform specific tasks. Since each service is independent, they communicate together via the HTTP Request (REST API) or Message Queue (Send/Receive or Public/Subscribe). 
The most benefit of micro-services architecture is ease of scaling, since the services are divided into micro, we easily scale up a particular service based on the number of incoming requests to it.
* Internal Services:
    * Product Service: provide the CRUD APIs for product
    * Identity Service: login/authenticate user and issue a token (to keep it simple for demonstrating purpose, the current implementation of login/authenticate is currently put in Product Service)
    * Analytics Service: record filters on the products, view on the products then aggregate the data to provide marketing reports such as Top Searching Products, Top Searching Brand, Top Viewed Product in the specific date ranges.
    * Analytics Worker: execute marketing reports which might take a long time due to the given long date ranges. For ex: the user would to see top searching products in 1 month Report which might take long time to calculate due to the numbers of search records in 1 month.
* Third parties:
    * Amazon SQS:  Message Queue service
    * Amazon S3: Storage service to store the product images
    * MongoDB cluster: Database cluster.
* Deployment tool:
    * Docker: packaging the container to image
    * Kubernetes: Container Management. The services is deployed to Worker Nodes in the Kubernetes cluster
    * Amazon Elastic Kubernetes Service (Amazon EKS): Deploy Kubernetes cluster to Amazon Web Service.

**Sequence diagrams**
* Search sequence diagram

![Search product sequence diagram](https://github.com/trongdau184/nab-product-service/blob/master/Search%20Product%20Diagram.png?raw=true)

* View product sequence diagram

![View product sequence diagram](https://github.com/trongdau184/nab-product-service/blob/master/View-product-diagram.png?raw=true)

**Features**
* Product APIs: Create, Update, Retrieve and Search Products, Get Product Detail and Delete Product
    * Retrieve and Search Product API:
        * Support search on any fields of the product
        * Advance search: The search product API not only supports "equal" operator but also other searching operators. The Search Operator supported as listed as below:

            | Search Operator   | Description   |
            | ----------------- | ----------    |
            | eq                | equals        |
            | lt                | litter than   |
            | lte               | litter than or equal  |
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
        * Sort: Client is able to specify the sort field and sort type (ASC|DESC) with format: {field}:{asc|desc} in the query string. For ex: add "name:asc" to query string to sort product by name, ascending

* User API: for demonstration purpose, the service provides the login API which returns the JWT token (not validate given username/input). The token then will be used in Authorization Header in the Request to protected APIs.

* API documentation url: http://localhost:5000/documentation

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
* Project structure followed "Folder by feature" structure which organizing projects into several folders with each folder representing a single feature.
* The "core" folder can be separated as a npm module which is used by the services.

**Software development principles, pattern & practices**
* 3 Layers Pattern: Controller - Service - Repository
* Inversion of control: make components loose coupling
* Highly reusable: Quickly to add new Rest API for resource with basic CRUD. Developer just needs to create route file, define the new Controller, create new Service class which extends BaseService class without adding any code, create new Repository class which extends BaseRepository class without adding any code, and add needed validators, DTOs. That's all.
* SOLID, KISS

**Frameworks & Libraries**
* Hapi: NodeJS API framework
* Boom: Generate Http friendly error objects
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

**Future Improvements**

The User login/authenticate API should be separated to the Identity Service
