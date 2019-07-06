import mongoose from 'mongoose';
import { UserType } from './constants';

const User = new mongoose.Schema({
  displayName: { type: String }
});

export default mongoose.model(UserType, User)