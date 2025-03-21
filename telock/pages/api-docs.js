// pages/api/index.js
import express from 'express';
import { swaggerUi, specs } from '../../../swagger';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// További API végpontok itt...

export default app;