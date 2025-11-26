import sqlite3 from 'sqlite3';
import path from 'path';

/**
 * Patrón Singleton para la conexión a la base de datos
 * Garantiza que solo exista una instancia de la conexión
 */
class Database {
  private static instance: Database;
  private db: sqlite3.Database | null = null;
  private readonly dbPath: string;

  /**
   * Constructor privado para evitar instanciación directa
   */
  private constructor() {
    this.dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
  }

  /**
   * Método estático para obtener la única instancia
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  /**
   * Conectar a la base de datos
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        console.log('✓ Base de datos ya conectada');
        resolve();
        return;
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('✗ Error al conectar a la base de datos:', err);
          reject(err);
        } else {
          console.log('✓ Conexión a la base de datos establecida');
          resolve();
        }
      });
    });
  }

  /**
   * Obtener la instancia de la base de datos
   */
  public getDb(): sqlite3.Database {
    if (!this.db) {
      throw new Error('Base de datos no conectada. Llama a connect() primero.');
    }
    return this.db;
  }

  /**
   * Ejecutar una query
   */
  public run(sql: string, params: any[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getDb().run(sql, params, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Obtener todos los registros
   */
  public all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      this.getDb().all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows as T[]);
      });
    });
  }

  /**
   * Obtener un solo registro
   */
  public get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this.getDb().get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row as T);
      });
    });
  }

  /**
   * Cerrar la conexión
   */
  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.db = null;
          console.log('✓ Conexión a la base de datos cerrada');
          resolve();
        }
      });
    });
  }

  /**
   * Inicializar las tablas
   */
  public async initializeTables(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const createReservationsTable = `
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        base_price REAL NOT NULL,
        total_price REAL NOT NULL,
        services TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `;

    try {
      await this.run(createUsersTable);
      await this.run(createReservationsTable);
      console.log('✓ Tablas inicializadas correctamente');
    } catch (error) {
      console.error('✗ Error al inicializar tablas:', error);
      throw error;
    }
  }
}

export default Database;