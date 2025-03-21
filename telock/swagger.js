// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vizsgaremek API',
      version: '1.0.0',
      description: 'API dokumentáció a vizsgaremekhez',
    },
    servers: [
      {
        url: 'https://vizsgaremek-mocha.vercel.app',
      },
    ],
  },
  apis: ['./pages/api/**/*.js'], 
};

const specs = swaggerJsDoc(options);

module.exports = { specs, swaggerUi };