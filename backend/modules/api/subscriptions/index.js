import { GraphQLObjectType } from 'graphql'
import bookAdded from './bookAdded'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    bookAdded
  }
})

export default subscription
