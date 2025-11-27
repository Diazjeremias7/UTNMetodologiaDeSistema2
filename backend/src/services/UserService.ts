import Database from '../config/database';
import bcrypt from 'bcryptjs';
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

    // Insertar usuario (hasheando la contraseña)
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    await this.db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
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

  // Devuelve usuario (incluye password) por email — usado para autenticación
  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.db.get<User>(
      'SELECT id, name, email, password, created_at FROM users WHERE email = ?',
      [email]
    );
  }

  // Autentica usuario: compara password y retorna usuario si coincide
  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (!user) throw new Error('Credenciales inválidas');

    const stored = user.password ?? '';

    // Detectar si stored está hasheado (bcrypt hashes comienzan con $2a$ o $2b$ o $2y$)
    const isHashed = stored.startsWith('$2');

    if (isHashed) {
      const ok = await bcrypt.compare(password, stored);
      if (!ok) throw new Error('Credenciales inválidas');
    } else {
      // migración: si estaba en texto plano y coincide, re-hashear y actualizar la DB
      if (stored !== password) throw new Error('Credenciales inválidas');
      const newHash = await bcrypt.hash(password, 10);
      await this.db.run('UPDATE users SET password = ? WHERE email = ?', [newHash, email]);
    }

    // remove password before returning
    const { password: _p, ...rest } = user as any;
    return rest as User;
  }

  async updatePhone(id: number, phone: string): Promise<void> {
    await this.db.run('UPDATE users SET phone = ? WHERE id = ?', [phone, id]);
  }
}

export default new UserService();