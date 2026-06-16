import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors as celebrateErrors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import authRoutes from './routes/authRoutes.js';
import dogRoutes from './routes/dogRoutes.js';
import { apiLimiter } from './middlewares/rateLimit.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(apiLimiter);

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'Dog Adoption API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js', './controllers/*.js']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/dogs', dogRoutes);

app.use(celebrateErrors());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
