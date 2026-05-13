// Vercel serverless function entry point
// This file is created for Vercel deployment
import app from '../dist/server.js';
import { initializeDatabase } from '../dist/database/init.js';

// Initialize database on cold start
let dbInitialized = false;
async function ensureDatabaseInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// Initialize database before handling requests
ensureDatabaseInitialized().catch(console.error);

export default app;
