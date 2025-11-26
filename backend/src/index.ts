import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from './config/database';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint (requerido por Docker)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Ruta de prueba
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'API de Reservas de Canchas de Fútbol',
    version: '1.0.0',
  });
});

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    // Conectar a la base de datos
    const db = Database.getInstance();
    await db.connect();
    await db.initializeTables();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
      console.log(`✓ API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  const db = Database.getInstance();
  await db.close();
  process.exit(0);
});

startServer();

export default app;