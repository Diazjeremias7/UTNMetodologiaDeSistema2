import { Request, Response } from 'express';
import UserService from '../services/UserService';
import jwt from 'jsonwebtoken';

class UserController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email y contraseña son requeridos' });
        return;
      }

      const user = await UserService.authenticate(email, password);

      // Crear token JWT
      const secret = process.env.JWT_SECRET || 'secret_dev';
      const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '1h' });

      res.json({ success: true, token, data: user });
    } catch (error) {
      res.status(401).json({ success: false, error: error instanceof Error ? error.message : 'Error de autenticación' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuarios',
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const user = await UserService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'Usuario no encontrado',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuario',
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await UserService.deleteUser(id);
      res.json({
        success: true,
        message: 'Usuario eliminado',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al eliminar usuario',
      });
    }
  }

  async updatePhone(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { phone } = req.body;
      
      if (!phone) {
        res.status(400).json({
          success: false,
          error: 'Teléfono requerido',
        });
        return;
      }

      await UserService.updatePhone(id, phone);
      res.json({
        success: true,
        message: 'Teléfono actualizado',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error al actualizar teléfono',
      });
    }
  }
}

export default new UserController();