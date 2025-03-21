// pages/api/swagger.js
import { specs, swaggerUi } from '../../../swagger';

export default function handler(req, res) {
  swaggerUi.setup(specs)(req, res);
}