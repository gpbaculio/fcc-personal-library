import { GraphQLObjectType } from 'graphql'
// local imports
import signup from './signup'
import login from './login'
import addBook from './addBook'
import addComment from './addComment'
import uploadProfilePicture from './uploadProfilePicture'

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup,
    login,
    addBook,
    addComment,
    uploadProfilePicture
  }
})

export default mutation
