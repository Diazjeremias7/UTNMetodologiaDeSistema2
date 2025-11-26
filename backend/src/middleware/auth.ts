import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header) return res.status(401).json({ success: false, error: 'Token requerido' });

  const token = Array.isArray(header) ? header[0].split(' ')[1] : (header as string).split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Token inválido' });

  const secret = process.env.JWT_SECRET || 'secret_dev';
  try {
    const payload = jwt.verify(token, secret) as any;
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Token inválido o expirado' });
  }
};

export default auth;
