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
          ...BookDetails_viewer
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
      viewer: viewer,
      book: viewer.book,
    }),
  }
)


export default BookDetailsQR