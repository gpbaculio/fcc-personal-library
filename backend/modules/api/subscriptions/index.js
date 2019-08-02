import { GraphQLObjectType } from 'graphql'

import bookAdded from './bookAdded'
import bookDeleted from './bookDeleted'
import commentAdded from './commentAdded'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    bookAdded,
    bookDeleted,
    commentAdded,
  }
})

export default subscription
