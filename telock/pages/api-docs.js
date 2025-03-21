import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger';

export default function handler(req, res) {
  if (req.method === 'GET') {
    swaggerUi.setup(swaggerSpec)(req, res);
  } else {
    res.status(405).send({ message: 'Method Not Allowed' });
  }
}

