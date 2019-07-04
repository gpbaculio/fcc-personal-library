import mongoose from 'mongoose';
import { BookType, CommentType, UserType } from './constants';

const User = new mongoose.Schema({
  displayName: { type: String },
  books: [{ type: Schema.Types.ObjectId, ref: BookType }],
  comments: [{ type: Schema.Types.ObjectId, ref: CommentType }]
});

export default mongoose.model(UserType, User)