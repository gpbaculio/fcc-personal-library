import sanitize from 'sanitize-filename'
import path from 'path'
import fs from 'fs'
import DataLoader from 'dataloader'

import Comment from './models/Comment'
import Book from './models/Book'
import User from './models/User'

const booksLoader = new DataLoader(async (bookIds) => {
  const books = await Book.find({
    _id: { $in: bookIds }
  }).populate({
    path: "userId", select: "username"
  }).sort('-createdAt')
  return books
})
const commentsLoader = new DataLoader(async (commentIds) => {
  const comments = await Comment.find({
    _id: { $in: commentIds }
  }).populate({
    path: "userId", select: "username"
  }).sort('-createdAt')
  return comments
})
const userLoader = new DataLoader(async (userIds) => {
  const users = await User.find({
    _id: { $in: userIds }
  })
  return users
})
const bookCommentsLoader = new DataLoader(async bookIds => {
  const comments = await Comment.find({
    bookId: { $in: bookIds }
  }).populate({
    path: 'userId', select: 'username profilePicture'
  }).sort('-createdAt')

  let bookKeys = comments.reduce((bookKeys, comment) => {
    bookKeys[comment.bookId] = bookKeys[comment.bookId] || []
    bookKeys[comment.bookId].push(comment)
    return bookKeys
  }, {})

  const bookComments = bookIds.map(bId => {
    const bidComments = bookKeys[bId]
    if (bidComments)
      return bidComments
    else
      return []
  })
  return bookComments
})

export const createComment = async (text, userId, bookId) => {
  const newComment = await Comment.create({
    text, userId, bookId,
  })
  const comment = await Comment.findById(newComment._id).populate({
    path: 'userId', select: 'username profilePicture'
  })
  return comment
}

export const getDocument = (_id, model) => {
  if (model === 'User') return getUser(_id)
  else if (model === 'Book') return getBook(_id)
  else if (model === 'Comment') return getComment(_id)
  else null
}

export const getUser = (userId) => {
  return User.findById(userId)
}

export const updateProfilePicture = async (userId, imgFile) => {
  const user = await User.findById(userId)
  try {
    const uploadPath = path.resolve(
      __dirname, '..', '..', 'frontend', 'public', 'static', 'images'
    )
    // delete on disk if existing
    if (user.profilePicture) {
      fs.unlink(`${uploadPath}/${user.profilePicture}`, error => {
        if (error) console.log(error)
      })
    }
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
  return Book.findById(bookId).populate({ path: 'userId', select: 'username' })
}

export const getComment = commentId => {
  return Comment.findById(commentId).populate({ path: 'userId', select: 'username' })
}

export const getBooksCount = () => {
  return Book.countDocuments({});
}

export const saveUser = ({ username, password }) => User.create({ username, password });

export const getUserComments = (userId) => {
  return Comment.find({ userId })
}



export const getBookComments = async (bookId) => {
  return bookCommentsLoader.load(bookId)
};
