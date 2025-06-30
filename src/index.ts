import express, { type Request, type Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './router/authRoutes';
import addStatusEndPoint, { startServiceRegistration } from './service';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// API Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Auth Microservice is running!');
});


addStatusEndPoint(app);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);

  startServiceRegistration();
});
