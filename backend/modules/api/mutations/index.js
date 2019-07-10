// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import signup from './signup'
import login from './login'
import addBook from './addBook'

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup,
    login,
    addBook
  }
})

export default mutation
