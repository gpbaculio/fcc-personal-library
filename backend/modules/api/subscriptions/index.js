import { GraphQLObjectType } from 'graphql'

import bookAdded from './bookAdded'
import commentAdded from './commentAdded'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    bookAdded,
    commentAdded
  }
})

export default subscription
