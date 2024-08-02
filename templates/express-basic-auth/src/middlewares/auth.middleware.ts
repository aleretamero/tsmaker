import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export class AuthMiddleware {
  auth = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { authorization } = req.headers;

      const token = this.extractTokenFromHeader(authorization);

      if (!token) {
        res.status(401).json({ error: 'Token invalid or not provided' });
        return;
      }

      const jwtSecret = process.env.JWT_SECRET!;

      const payload = jwt.verify(token, jwtSecret) as jwt.JwtPayload;

      req.userId = payload.sub;

      next();
    } catch (error) {
      res.status(401).json({ error: 'Token invalid or not provided' });
    }
  };

  extractTokenFromHeader = (authorization?: string): string | undefined => {
    const [type, token] = authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  };
}

export const authMiddleware = new AuthMiddleware();
