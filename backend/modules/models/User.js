import mongoose from 'mongoose';

const User = new mongoose.Schema({
  displayName: { type: String }
});

export default mongoose.model('User', User)