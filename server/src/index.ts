import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { requireApiKey } from './middleware/apiKey';
import { errorHandler } from './middleware/errorHandler';

import patientsRouter from './routes/patients';
import templatesRouter from './routes/templates';
import submissionsRouter from './routes/submissions';
import analyticsRouter from './routes/analytics';
import authRouter from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Apply API Key auth to all API routes
app.use('/v1', requireApiKey);

// Routes
app.use('/v1/patients', patientsRouter);
app.use('/v1/templates', templatesRouter);
app.use('/v1/submissions', submissionsRouter);
app.use('/v1/analytics', analyticsRouter);
app.use('/v1/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

// Error handling
app.use(errorHandler);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medformpro';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

