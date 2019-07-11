
import Comment from './models/Comment'
import Book from './models/Book'
import User from './models/User'

export const createBook = (title, userId) => Book.create({ title, userId }).then(book => {
  return Book.populate(book, { path: "userId", select: "username" })
});

export const createComment = (text, userId, bookId) => Comment.create({
  text,
  userId,
  bookId,
});

export const getDocument = (_id, model) => {
  if (model === 'User') return User.findOne({ _id })
  else if (model === 'Book') return Book.findOne({ _id })
  else if (model === 'Comment') return Comment.findOne({ _id })
  else null
}

export const getUser = (userId) => {
  return User.findById(userId, '_id username')
}

export const findUsername = (username) => User.findOne({ username })

export const getUserBooks = (userId) => {
  return Book.find({ userId }).populate('userId', 'username').sort('-createdAt')
}

export const saveUser = ({ username, password }) => User.create({ username, password });

export const getUserComments = (userId) => {
  return Comment.find({ userId })
}

export const getBookComments = (bookId) => Comment.find({ bookId }).populate({
  path: 'userId',
  select: 'username'
}).sort('-createdAt');