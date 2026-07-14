// backend/src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { importCSVHandler } from './importController';

// Load environmental variables securely
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Uses port 5000 matching your terminal baseline

// Configure Multer to intercept single file uploads in-memory
const upload = multer({ storage: multer.memoryStorage() });

// 🚀 MASTER CORS FIX: Enable loose credential-free wildcard access for local testing
// app.use(cors({
//   origin: [
//     'http://localhost:3000', 
//     'http://127.0.0.1:3000',
//     'http://localhost:5173', 
//     'http://127.0.0.1:5173'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true
// }));

app.use(cors({
  origin: [
    "https://groweasy-csv-importer-1-94fr.onrender.com",
    "http://localhost:3000"
  ],
  credentials: true
}));

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

// Force Express to bind smoothly to local interfaces
app.listen(Number(PORT), () => {
  console.log(`🚀 CRM Engine running on port ${PORT}`);
});

export default app;
