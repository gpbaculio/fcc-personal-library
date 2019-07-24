import sanitize from 'sanitize-filename'
import path from 'path'
import fs from 'fs'
import DataLoader from 'dataloader'

import Comment from './models/Comment'
import Book from './models/Book'
import User from './models/User'

const bookCommentsLoader = new DataLoader(async bookIds => {
  const comments = await Comment.find({
    bookId: { $in: bookIds }
  }).populate({
    path: 'userId', select: 'username profilePicture id'
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

export const createBook = async (title, userId) => {
  const newBookt = await Book.create({
    title, userId
  })
  const comment = await Book.findById(newBookt._id).populate({
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

export const getBooks = async ({ page, limit, searchText, userId }) => {
  const query = {}
  if (searchText !== undefined) {
    if (searchText === '') return []
    query.title = { $regex: `${searchText}`, $options: 'i' }
  }
  if (userId) query.userId = userId
  return Book.find(
    query,
    null,
    { skip: parseInt(page - 1) * parseInt(limit), limit: parseInt(limit) }
  ).populate({ path: 'userId', select: 'username profilePicture' })
    .sort('-createdAt');
}
export const updateBookTitle = (title, bookId) => {
  return Book.findOneAndUpdate(
    { _id: bookId },
    { $set: { title } },
    { new: true }
  );
}
export const updateCommentText = (text, commentId) => {
  return Comment.findOneAndUpdate(
    { _id: commentId },
    { $set: { text } },
    { new: true }
  );
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

export const getBookCommentsCount = async bookId => {
  return Comment.countDocuments({ bookId })
}

export const getBookComments = async (bookId) => {
  return bookCommentsLoader.load(bookId)
};

export const deleteBook = async bookId => {
  try {
    await Book.findOneAndRemove({ _id: bookId });
    return bookId
  } catch (e) {
    return null
  }
}
export const deleteComment = async commentId => {
  try {
    await Comment.findOneAndRemove({ _id: commentId });
    return commentId
  } catch (e) {
    return null
  }
}