// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import signup from './signup'
import login from './login'

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    signup,
    login
  }
})

export default mutation
