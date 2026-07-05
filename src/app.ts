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
      schemas: {
        AuthRequest: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['username', 'password'],
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
          },
        },
        Paciente: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nombre: { type: 'string' },
            rut: { type: 'string' },
            edad: { type: 'integer' },
            direccion: { type: 'string' },
            alergias: {
              type: 'array',
              items: { type: 'string' },
            },
            consultas: {
              type: 'array',
              items: { $ref: '#/components/schemas/Consulta' },
            },
            examenes: {
              type: 'array',
              items: { type: 'string' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Consulta: {
          type: 'object',
          properties: {
            fecha: { type: 'string', format: 'date' },
            motivo: { type: 'string' },
            diagnostico: { type: 'string' },
          },
          required: ['fecha', 'motivo', 'diagnostico'],
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.use('/pacientes', pacientesRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

export default app;
