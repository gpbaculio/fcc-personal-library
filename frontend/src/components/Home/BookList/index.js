import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import { BookListRefetchContainer, BookList } from './BookList';

const HomeQR = createQueryRenderer(
  BookListRefetchContainer,
  BookList,
  {
    query: graphql`
      query BookListQuery {
        viewer {
          id
          username
          ...Home_viewer
        }
      }
    `,
    variables: { count: 5 },
    getFragmentProps: ({ viewer }) => ({ viewer })
  })

export default HomeQR