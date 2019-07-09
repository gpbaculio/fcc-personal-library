import jwt from 'jsonwebtoken';
import User from './models/User';
import { getUser } from './database';

export const getUserContext = (token) => {
  if (!token) return null;
  try {
    const { id } = jwt.verify(token.substring(7), process.env.JWT_SECRET_KEY);
    return getUser(id);
  } catch (e) {
    return null
  }
}

export const generateToken = (user) => `Bearer ${jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY)}`;
