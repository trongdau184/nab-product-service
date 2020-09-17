import * as HapiSwagger from 'hapi-swagger';

const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
        title: 'Product API Documentation',
        version: '1.0.0',
        description: 'Product APIs'
    },
    grouping: 'tags',
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [{ jwt: [] }]
};

export default {
    plugin: HapiSwagger,
    options: swaggerOptions
};
