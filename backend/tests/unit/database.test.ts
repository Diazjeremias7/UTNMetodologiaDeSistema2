import Database from '../../src/config/database';

describe('Database Singleton Pattern', () => {
  afterAll(async () => {
    const db = Database.getInstance();
    await db.close();
  });

  test('debe retornar siempre la misma instancia', () => {
    const db1 = Database.getInstance();
    const db2 = Database.getInstance();
    
    expect(db1).toBe(db2);
  });

  test('debe conectar a la base de datos correctamente', async () => {
    const db = Database.getInstance();
    await expect(db.connect()).resolves.not.toThrow();
  });

  test('debe inicializar tablas correctamente', async () => {
    const db = Database.getInstance();
    await db.connect();
    await expect(db.initializeTables()).resolves.not.toThrow();
  });

  test('debe ejecutar queries correctamente', async () => {
    const db = Database.getInstance();
    await db.connect();
    await db.initializeTables();
    
    const result = await db.all('SELECT name FROM sqlite_master WHERE type="table"');
    expect(result).toBeDefined();
  });
});