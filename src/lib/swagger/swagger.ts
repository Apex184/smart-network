import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Connectify API Documentation',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);

export const swagger = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(specs);