import { Request, Response } from 'express';
import UserService from '../services/UserService';

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
}

export default new UserController();