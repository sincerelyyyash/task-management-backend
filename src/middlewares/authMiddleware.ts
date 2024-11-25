import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

declare module 'express' {
  interface Request {
    user?: User;
  }
}

const prisma = new PrismaClient();

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as { userId: number };

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.userId
      }
    });


    if (!user) {
      return res.status(401).json({ message: "Invalid access token" });
    }


    req.user = user;
    next();
  } catch (error) {

    return res.status(401).json({ message: "Invalid Access Token" });
  }
};
