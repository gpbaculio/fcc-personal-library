import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from '../../createQueryRenderer';
import { AddBookFC, AddBook } from './AddBook';

const AddBookQR = createQueryRenderer(
  AddBookFC,
  AddBook,
  {
    query: graphql`
      query AddBookQuery {
        viewer {
          id
          ...AddBook_viewer
        }
      }
    `,
    getFragmentProps: ({ viewer }) => ({
      viewer,
    }),
  })

export default AddBookQR