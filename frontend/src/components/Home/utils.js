import { ConnectionHandler } from 'relay-runtime';

export const booksUpdater = (userProxy, bookEdge) => {
  const connection = ConnectionHandler.getConnection(userProxy, 'BookList_books');
  ConnectionHandler.insertEdgeBefore(connection, bookEdge);
}