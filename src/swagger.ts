import swaggerJsdoc from 'swagger-jsdoc';
import appConfig from './config/app.config';

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: appConfig.app.name,
      version: appConfig.app.version,
      description: appConfig.app.description || 'API Documentation',
      contact: {
        name: appConfig.app.author,
      },
    },
    servers: [
      {
        url: `http://localhost:${appConfig.port}`,
        description: 'Local server',
      },
      {
        url: appConfig.app.url || `http://localhost:${appConfig.port}`,
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /auth/login',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  statusCode: { type: 'number', example: 401 },
                  message: { type: 'string', example: 'No token provided' },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  statusCode: { type: 'number', example: 400 },
                  message: { type: 'string', example: 'Validation failed' },
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        path: { type: 'string' },
                        message: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: { type: 'string', example: 'error' },
                  statusCode: { type: 'number', example: 500 },
                  message: { type: 'string', example: 'Internal Server Error' },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
  customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { font-size: 2.5em; }
    `,
  customSiteTitle: `${appConfig.app.name} API Docs`,
};
