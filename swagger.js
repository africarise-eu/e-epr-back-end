const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'TAE api',
            version: '1.0.0',
            description:
                'Our API empowers developers with versatile endpoints for seamless integration, enabling data retrieval, processing, analysis, and innovative application enhancements.',
            contact: {
                name: 'TAE',
                url: 'https://www.tae.com/',
                email: 'info@tae.com',
            },
        },
        servers: [{ url: '/api/v1' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    in: 'header',
                    name: 'authorization',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
            schemas: {
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' }, // Define your data structure here
                    },
                },
                BadRequest: {
                    type: 'Object',
                    properties: {
                        status: { type: 'boolean', default: false },
                        code: { type: 'integer', default: 400 },
                        type: { type: 'string' },
                        message: { type: 'string' },
                        data: { type: 'object', default: {} },
                        error: { type: 'boolean', default: true },
                    },
                },
                NotFound: {
                    type: 'object',
                    properties: {
                        status: { type: 'boolean', default: false },
                        code: { type: 'integer', default: 404 },
                        type: { type: 'string' },
                        msg: { type: 'string' },
                        data: { type: 'object', default: {} },
                        error: { type: 'boolean', default: true },
                    },
                },
                Unauthorized: {
                    type: 'Object',
                    properties: {
                        status: { type: 'boolean', default: false },
                        code: { type: 'integer', default: 401 },
                        type: { type: 'string' },
                        msg: { type: 'string' },
                        data: { type: 'object', default: {} },
                        error: { type: 'boolean', default: true },
                    },
                },
                createSuccess: {
                    type: 'Object',
                    properties: {
                        status: {
                            type: 'string',
                            default: 'success',
                        },
                        code: {
                            type: 'integer',
                            default: 201,
                        },
                        msg: {
                            type: 'string',
                        },
                        error: {
                            type: 'string',
                            default: false,
                        },
                    },
                },
                ValidationError: {
                    type: 'Object',
                    properties: {
                        status: {
                            type: 'string',
                            default: false,
                        },
                        code: {
                            type: 'integer',
                            default: 412,
                        },
                        type: {
                            type: 'string',
                        },
                        msg: {
                            type: 'string',
                        },
                        data: {
                            type: 'object',
                            default: {},
                        },
                        error: {
                            type: 'boolean',
                            default: true,
                        },
                    },
                },
                List: {
                    type: 'Object',
                    properties: {
                        status: {
                            type: 'string',
                            default: 'success',
                        },
                        code: {
                            type: 'integer',
                            default: '200',
                        },
                        msg: {
                            type: 'string',
                        },
                        data: {
                            type: 'Object',
                            properties: {
                                count: {
                                    type: 'integer',
                                    default: 0,
                                },
                                raws: {
                                    type: 'array',
                                    default: [],
                                },
                            },
                        },
                        error: {
                            type: 'boolean',
                            default: false,
                        },
                    },
                },
                UnPaginatedList: {
                    type: 'Object',
                    properties: {
                        status: {
                            type: 'string',
                            default: 'success',
                        },
                        code: {
                            type: 'integer',
                            default: '200',
                        },
                        msg: {
                            type: 'string',
                        },
                        data: {
                            type: 'array',
                            default: [],
                        },
                        error: {
                            type: 'boolean',
                            default: false,
                        },
                    },
                },
                commonCreate: {
                    type: 'Object',
                    properties: {
                        status: {
                            type: 'string',
                            default: 'success',
                        },
                        code: {
                            type: 'integer',
                            default: 201,
                        },
                        msg: {
                            type: 'string',
                        },
                        data: {
                            type: 'Object',
                            properties: {
                                skillId: {
                                    type: 'string',
                                },
                                companyId: {
                                    type: 'string',
                                },
                                id: {
                                    type: 'id',
                                },
                            },
                        },
                        error: {
                            type: 'boolean',
                            default: false,
                        },
                    },
                },
            },
        },
        tags: [{ name: 'Company' }, { name: 'User' }],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
    swaggerSpec,
};
