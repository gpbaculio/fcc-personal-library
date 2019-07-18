import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import { BookDetailsFC, BookDetails } from './BookDetails';

const BookDetailsQR = createQueryRenderer(
  BookDetailsFC,
  BookDetails,
  {
    query: graphql`
      query BookDetailsQuery ($bookId: String, $count: Int, $cursor: String) {
        viewer {
          id
          profilePicture
          book(bookId:$bookId) {
            ...BookDetails_book
          }
        }
      }
    `,
    queriesParams: ({ match: { params: { bookId } } }) => ({
      bookId
    }),
    getFragmentProps: ({ viewer }) => ({
      viewerId: viewer.id,
      book: viewer.book,
    }),
  }
)


export default BookDetailsQR