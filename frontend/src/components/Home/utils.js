import { ConnectionHandler } from 'relay-runtime';

export const booksUpdater = (userProxy, bookEdge) => {
  const connection = ConnectionHandler.getConnection(userProxy, 'Show_BookList_viewer_books');
  ConnectionHandler.insertEdgeBefore(connection, bookEdge);
}