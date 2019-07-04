import mongoose from 'mongoose';

const Comment = new mongoose.Schema({
  comment: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model('Comment', Comment)