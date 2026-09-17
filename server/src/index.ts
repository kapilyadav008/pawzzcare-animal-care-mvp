import { app } from './app.js';
import { config } from './config.js';
import { connectDB } from './db.js';

async function startServer() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`==================================================`);
    console.log(`PawzzCare Backend Running on Port ${config.port}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`AI Engine: ${config.geminiApiKey ? 'Gemini 2.5 Active' : 'Fallback AI Engine (Demo)'}`);
    console.log(`==================================================`);
  });
}

startServer();
