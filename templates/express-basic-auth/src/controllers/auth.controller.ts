import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { authService } from '../services/auth.service';

export class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await authService.login(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const jwtSecret = process.env.JWT_SECRET!;

      const token = jwt.sign({}, jwtSecret, {
        subject: user.id,
        expiresIn: '1d',
      });

      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      if (await authService.emailAlreadyExists(email)) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const user = await authService.register(email, password);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async me(req: Request, res: Response) {
    const id = req.userId;

    if (!id) {
      return res.status(401).json({ error: 'User not found' });
    }

    try {
      const user = await authService.findById(id);

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export const authController = new AuthController();
