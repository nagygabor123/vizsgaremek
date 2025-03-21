// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TELOCK API Dokumentáció',
    version: '1.0.0',
    description: 'API dokumentáció a TELOCK szoftverhez',
  },
  servers: [
    {
      url: 'https://vizsgaremek-mocha.vercel.app/',
      description: 'Fejlesztői szerver',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
