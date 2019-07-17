import sanitize from 'sanitize-filename'
import path from 'path'
import fs from 'fs'

import Comment from './models/Comment'
import Book from './models/Book'
import User from './models/User'

export const createBook = (title, userId) => Book.create({ title, userId }).then(book => {
  return Book.populate(book, { path: "userId", select: "username" })
});

export const createComment = (text, userId, bookId) => {
  return Comment.create({
    text,
    userId,
    bookId,
  });
}

export const getDocument = (_id, model) => {
  if (model === 'User') return User.findOne({ _id })
  else if (model === 'Book') return Book.findOne({ _id })
  else if (model === 'Comment') return Comment.findOne({ _id })
  else null
}

export const getUser = (userId) => {
  return User.findById(userId)
}

export const updateProfilePicture = async (userId, imgFile) => {
  try {
    const uploadPath = path.resolve(
      __dirname, '..', '..', 'frontend', 'public', 'static', 'images'
    )
    // add hash to sanitized file name
    const fileName = `${Date.now()}_${sanitize(
      imgFile.originalname.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>{}[]\\\/]/gi, ''),
    )}`
    const filePath = path.join(
      uploadPath, fileName
    )
    const viewer = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { profilePicture: fileName } },
      { new: true }
    );
    // save file to disk
    fs.writeFileSync(filePath, imgFile.buffer)
    return { viewer }
  } catch (e) {
    console.log(e)
    return { viewer: null }
  }
}

export const findUsername = (username) => User.findOne({ username })

export const getBooks = ({ page, limit, searchText }) => {
  const query = {}
  if (searchText !== undefined) {
    if (searchText === '') return []
    query.title = { $regex: `${searchText}`, $options: 'i' }
  }
  return Book.find(
    query,
    null,
    { skip: parseInt(page - 1) * parseInt(limit), limit: parseInt(limit) }
  ).populate({ path: 'userId', select: 'username' })
    .sort('-createdAt');
}

export const getBook = bookId => {
  return Book.findById(bookId)
    .populate({ path: 'userId', select: 'username' })
    .sort('-createdAt');
}

export const getBooksCount = () => {
  return Book.countDocuments({});
}

export const saveUser = ({ username, password }) => User.create({ username, password });

export const getUserComments = (userId) => {
  return Comment.find({ userId })
}

export const getBookComments = (bookId) => {
  return Comment.find({ bookId })
    .populate({ path: 'userId', select: 'username' })
    .sort('-createdAt')
};