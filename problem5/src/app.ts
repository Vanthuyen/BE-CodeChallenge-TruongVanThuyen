import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { initDatabase } from './config/database';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CRUD API is running!' });
});

app.use('/api/users', userRoutes);

initDatabase();

export default app;