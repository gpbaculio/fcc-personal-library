// external imports
import { GraphQLObjectType } from 'graphql'
// local imports
import createBook from './createBook'

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createBook,
  }
})

export default mutation
