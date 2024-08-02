import * as bcrypt from 'bcrypt';
import { prismaClient } from '../prisma/prisma-client';

export class AuthService {
  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async findById(id: string) {
    return prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }

  async emailAlreadyExists(email: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    return !!user;
  }
}

export const authService = new AuthService();
