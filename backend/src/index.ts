import dotenv from 'dotenv';
import app from './app';
import Database from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  try {
    // Conectar base de datos
    const db = Database.getInstance();
    await db.connect();
    await db.initializeTables();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`✓ API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  const db = Database.getInstance();
  await db.close();
  process.exit(0);
});

startServer();