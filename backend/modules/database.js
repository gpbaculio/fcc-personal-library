
import {
  User,
  Book,
  Comment
} from './models'

export const getDocument = (_id, model) => {
  if (model === 'User') return User.findOne({ _id })
  else if (model === 'Book') return Book.findOne({ _id })
  else if (model === 'Comment') return Comment.findOne({ _id })
  else null
}

export const getBooksByUser = (userId) => {
  return Book.find({ userId })
}

export const getCommentsByUser = (userId) => {
  return Comment.find({ userId })
}