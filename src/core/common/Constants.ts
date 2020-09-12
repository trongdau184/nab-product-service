export const FIELD_TYPES = {
    STRING: "string",
    EMAIL: "email",
    MOBILE: "mobile",
    NUMBER: "number",
    DATE: "date",
    TIME: "time",
    DATE_TIME: "datetime",
    SINGLE: "single",
    MULTI: "multi",
    BOOLEAN: "boolean"
};

export const NODE_ENV = {
    DEV: "dev",
    TEST: "test",
    STAGING: "staging",
    PRODUCTION: "production"
};

export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};

export const HTTP_HEADERS = {
    AUTH: 'authorization',
    CLIENT_REQUEST: 'Client-Request',
    CONTENT_TYPE: 'Content-Type'
};

export const TRACING = {
    TRACER_SESSION: 'TRACER_SESSION',
    TRANSACTION_ID: 'x-request-id'
};

export const CLS_NAMESPACE = 'requestContext';