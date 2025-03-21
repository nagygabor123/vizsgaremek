import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vizsgaremek API',
      version: '1.0.0',
      description: 'API dokumentáció a vizsgaremek alkalmazáshoz.',
    },
    servers: [
      {
        url: 'https://vizsgaremek-mocha.vercel.app/api',
      },
    ],
  },
  apis: ['./pages/api/**/*.js'], // Az összes API fájlt beolvassa a mappából
};

const swaggerSpec = swaggerJsdoc(options);

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
}
