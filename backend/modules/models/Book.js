import mongoose from 'mongoose';
import { BookType, UserType, CommentType } from './constants';

const Book = new mongoose.Schema({
  title: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserType
  }
}, {
    timestamps: true
  });

export default mongoose.model(BookType, Book)