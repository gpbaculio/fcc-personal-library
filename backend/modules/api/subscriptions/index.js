import { GraphQLObjectType } from 'graphql'

import bookAdded from './bookAdded'
import bookDeleted from './bookDeleted'
import bookTitleUpdated from './bookTitleUpdated'
import commentAdded from './commentAdded'
import commentDeleted from './commentDeleted'
import commentTextUpdated from './commentTextUpdated'

const subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    bookAdded,
    bookTitleUpdated,
    bookDeleted,
    commentAdded,
    commentTextUpdated,
    commentDeleted
  }
})

export default subscription
