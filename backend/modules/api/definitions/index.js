// external imports
import { nodeDefinitions, fromGlobalId } from 'graphql-relay'
// local imports
import { getDocument } from '../../database'
import Comment from '../../models/Comment'
import Book from '../../models/Book'
import User from '../../models/User'
import { UserType, BookType, CommentType } from './constants';
import GraphQLCommentType from '../query/objectTypes/comment';
import GraphQLBookType from '../query/objectTypes/book';
import GraphQLUserType from '../query/objectTypes/user';

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
    else if (obj instanceof Comment) return GraphQLCommentType;
    else return null
  }
);
