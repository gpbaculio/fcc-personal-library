
import Comment from './models/Comment'
import Book from './models/Book'
import User from './models/User'

export const createBook = ({ text, userId }) => {
  return Book.create({ text, userId }, (_err, book) => book.populate('userId'));
}

export const getDocument = (_id, model) => {
  if (model === 'User') return User.findOne({ _id })
  else if (model === 'Book') return Book.findOne({ _id })
  else if (model === 'Comment') return Comment.findOne({ _id })
  else null
}

export const getUser = (userId) => {
  return User.findOne({ _id: userId }, '_id displayName')
}

export const getUserBooks = (userId) => {
  return Book.find({ userId }).populate('userId')
}

export const getUserComments = (userId) => {
  return Comment.find({ userId })
}

export const getBookComments = (bookId) => Comment.find({ bookId }).populate('commentId');