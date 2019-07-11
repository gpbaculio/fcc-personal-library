import graphql from 'babel-plugin-relay/macro';

import createQueryRenderer from '../../createQueryRenderer';
import LoadingView from './LoadingView'
import ErrorView from './ErrorView'
import BookListContainer from './BookListContainer'

const BookListQuery = graphql`
  query BookListQuery($count: Int, $cursor: String) {
    viewer {
      ...BookListContainer_viewer
    }
  }
`;

export default createQueryRenderer(
  BookListContainer,
  {
    query: BookListQuery,
    variables: { count: 5 },
    LoadingView,
    ErrorView
  })