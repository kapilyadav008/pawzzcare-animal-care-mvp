import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { errorHandler } from './middleware/errorHandler.js';
import healthRouter from './routes/health.js';
import assistantRouter from './routes/assistant.js';
import medicalRecordsRouter from './routes/medicalRecords.js';
import petsRouter from './routes/pets.js';
import providersRouter from './routes/providers.js';

export const app = express();

// Middlewares
app.use(cors({ origin: config.clientUrl || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRouter);
app.use('/api/assistant', assistantRouter);
app.use('/api/medical-records', medicalRecordsRouter);
app.use('/api/pets', petsRouter);
app.use('/api/providers', providersRouter);

// Centralized error handler
app.use(errorHandler);
