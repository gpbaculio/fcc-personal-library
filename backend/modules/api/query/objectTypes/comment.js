// external imports
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean
} from 'graphql';

import { globalIdField } from 'graphql-relay'
import GraphQLUserType from './user';
import { UserType } from '../../definitions/constants';

const GraphQLCommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: globalIdField('Comment'),
    text: {
      type: GraphQLString,
      resolve: ({ text }) => text,
    },
    owner: {
      name: 'CommentOwner',
      type: GraphQLUserType,
      resolve: ({
        userId: {
          _id, username, profilePicture
        }
      }) => {
        return ({ id: `${_id}`, username, profilePicture })
      },
      fields: () => ({
        id: globalIdField('CommentOwner'),
        username: {
          type: GraphQLString,
          resolve: ({ username }) => username
        },
        profilePicture: {
          type: GraphQLString,
          resolve: ({ profilePicture }) => profilePicture || 'default'
        },
      })
    },
    createdAt: {
      type: GraphQLString,
      resolve: ({ createdAt }) => createdAt,
    }
  }),
});

export default GraphQLCommentType;