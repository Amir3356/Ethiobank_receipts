import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { execSync } from 'child_process';
import receiptRoutes from './routes/receiptRoutes.js';

dotenv.config();

const app = express();
const BASE_PORT = parseInt(process.env.PORT, 10) || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/receipts', receiptRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'EthioBank Receipts API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

function startServer(port) {
  const server = createServer(app);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      try {
        const pid = execSync(`lsof -ti:${port}`, { encoding: 'utf8', timeout: 3000 }).trim();
        if (pid) execSync(`kill -9 ${pid}`, { timeout: 3000 });
      } catch {
        // process already dead or lsof not available
      }
      setTimeout(() => {
        server.close();
        startServer(port);
      }, 500);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer(BASE_PORT);

export default app;
