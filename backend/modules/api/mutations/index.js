import { GraphQLObjectType } from 'graphql'
// local imports
import signup from './signup'
import login from './login'
import addBook from './addBook'
import addComment from './addComment'
import uploadProfilePicture from './uploadProfilePicture'
import updateBookTitle from './updateBookTitle'
import updateCommentText from './updateCommentText'
import deleteBook from './deleteBook'
import deleteComment from './deleteComment'

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup,
    login,
    addBook,
    addComment,
    uploadProfilePicture,
    updateBookTitle,
    updateCommentText,
    deleteBook,
    deleteComment
  }
})

export default mutation
