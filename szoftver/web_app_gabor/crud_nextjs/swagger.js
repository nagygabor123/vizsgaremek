// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CRUD API Dokumentáció',
    version: '1.0.0',
    description: 'Dokumentáció a CRUD műveletekhez',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Fejlesztői szerver',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./pages/api/**/*.js'], // Az API route-ok helye
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
