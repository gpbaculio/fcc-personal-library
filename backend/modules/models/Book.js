import mongoose from 'mongoose';

const Book = new mongoose.Schema({
  title: { type: String },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

export default mongoose.model('Book', Book)