import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './controllers/errorHandler';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
    });
});

// Error handler
app.use(errorHandler);

export default app;