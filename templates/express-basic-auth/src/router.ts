import { Router } from 'express';
import { authController } from './controllers/auth.controller';
import { authMiddleware } from './middlewares/auth.middleware';

export const router = Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authMiddleware.auth, authController.me);
