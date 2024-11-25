import jwt from 'jsonwebtoken';

const SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_secret_key';

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
