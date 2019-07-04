import mongoose from 'mongoose';
import { BookType, UserType, CommentType } from './constants';

const Book = new mongoose.Schema({
  title: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserType
  },
  comments: [{ type: Schema.Types.ObjectId, ref: CommentType }]
});

export default mongoose.model(BookType, Book)