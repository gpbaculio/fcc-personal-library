import { ConnectionHandler } from 'relay-runtime';

export const booksUpdater = (userProxy, bookEdge) => {
  const connection = ConnectionHandler.getConnection(userProxy, 'Connection_BookList_viewer_books');
  ConnectionHandler.insertEdgeBefore(connection, bookEdge);
}