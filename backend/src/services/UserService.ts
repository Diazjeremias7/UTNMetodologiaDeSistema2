import Database from '../config/database';
import { User, CreateUserDTO } from '../types';

class UserService {
  private db = Database.getInstance();

  async createUser(data: CreateUserDTO): Promise<User> {
    const { name, email, password } = data;

    // Verificar si el email ya existe
    const existing = await this.db.get<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing) {
      throw new Error('El email ya está registrado');
    }

    // Insertar usuario
    await this.db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    );

    // Obtener el usuario creado
    const user = await this.db.get<User>(
      'SELECT id, name, email, created_at FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new Error('Error al crear usuario');
    }

    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.db.get<User>(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [id]
    );
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.all<User>('SELECT id, name, email, created_at FROM users');
  }

  async deleteUser(id: number): Promise<void> {
    await this.db.run('DELETE FROM users WHERE id = ?', [id]);
  }
}

export default new UserService();