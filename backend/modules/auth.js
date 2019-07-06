import jwt from 'jsonwebtoken';
import User from './models/User';

export const getUser = (token) => {
  if (!token) return null;
  const { id: _id } = jwt.verify(token.substring(7), process.env.JWT_SECRET_KEY);
  return User.findOne({ _id });
}

export const generateToken = (user) => `Bearer ${jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY)}`;
