import mongoose from 'mongoose';
import { UserType, BookType, CommentType } from './constants';

const Comment = new mongoose.Schema({
  comment: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserType
  },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: BookType }
});

export default mongoose.model(CommentType, Comment)