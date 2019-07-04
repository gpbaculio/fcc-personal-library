// external imports
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
// local imports
import { getDocument } from '../../database'
import { User, Book, Comment } from '../../models'
import { GraphQLUserType, GraphQLBookType, GraphQLCommetType } from '../query/objectTypes'
import { UserType, BookType, CommentType } from './constants';

export const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId)
    if (type === UserType) return getDocument(id, UserType);
    else if (type === BookType) return getDocument(id, BookType);
    else if (type === CommentType) return getDocument(id, CommentType);
    else return null
  },
  obj => {
    if (obj instanceof User) return GraphQLUserType;
    else if (obj instanceof Book) return GraphQLBookType;
    else if (obj instanceof Comment) return GraphQLCommetType;
    else return null
  }
);
