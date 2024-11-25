import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken } from '../lib/jwt';
import { z } from 'zod';

const prisma = new PrismaClient();


const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  try {
    signUpSchema.parse({ name, email, password });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    const token = generateToken(user.id);
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      next(error);
    }
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    signInSchema.parse({ email, password });

    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id);
      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      next(error);
    }
  }
};
