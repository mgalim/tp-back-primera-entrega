import { env } from '../config/env.js';
import jwt from 'jsonwebtoken';
export const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};
