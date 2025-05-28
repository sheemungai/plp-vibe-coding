import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import priceRoutes from './routes/priceRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/prices', priceRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server (no MongoDB connection needed)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 