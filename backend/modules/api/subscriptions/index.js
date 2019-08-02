import { GraphQLObjectType } from 'graphql'

import bookAdded from './bookAdded'
import bookDeleted from './bookDeleted'
import bookTitleUpdated from './bookTitleUpdated'
import commentAdded from './commentAdded'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    bookAdded,
    bookTitleUpdated,
    bookDeleted,
    commentAdded,
  }
})

export default subscription
