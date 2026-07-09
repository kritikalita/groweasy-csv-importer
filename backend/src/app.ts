import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { importCSVHandler } from './importController';

// Load environment configurations securely
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configure Multer to intercept single file uploads in-memory
const upload = multer({ storage: multer.memoryStorage() });

// Middlewares
app.use(cors());
app.use(express.json());

// Basic Network Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'GrowEasy CSV Importer Engine'
  });
});

// Production AI Processing Import Target Endpoint
app.post('/api/import', upload.single('file'), importCSVHandler);

// Start listening for inbound connections
app.listen(PORT, () => {
  console.log(`🚀 CRM Engine running smoothly on http://localhost:${PORT}`);
});

export default app;