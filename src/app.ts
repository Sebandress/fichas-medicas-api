import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import pacientesRouter from './routes/pacientes';
import authRouter from './routes/auth';
import { connectDB } from './config/db';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fichas Médicas API',
      version: '0.1.0',
      description: 'Documentación interactiva de la API para fichas médicas con autenticación JWT.',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/pacientes', pacientesRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;
