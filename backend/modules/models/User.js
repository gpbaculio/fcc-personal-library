import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserType } from './constants';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    hidden: true
  }
});

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this
      .encryptPassword(this.password)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(err => next(err));
  } else {
    return next();
  }
});

userSchema.methods = {
  authenticate(plainTextPassword) {
    try {
      return bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
      return false;
    }
  },
  encryptPassword(password) {
    return bcrypt.hash(password, 8);
  }
};

export default mongoose.model('User', userSchema);
