import jwt from 'jsonwebtoken';
import User from './models/User';

export const getUser = (token) => {
  if (!token) return ({ user: null });
  try {
    const { id: _id } = jwt.verify(token.substring(7), process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id })
    return ({ user });
  } catch (err) {
    return ({ user: null });
  }
}

export const generateToken = (user) => {
  return `Bearer ${jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY)}`;
}