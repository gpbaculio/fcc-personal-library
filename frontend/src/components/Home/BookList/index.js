import graphql from 'babel-plugin-relay/macro';

import createQueryRenderer from '../../createQueryRenderer';
import LoadingView from './LoadingView'
import ErrorView from './ErrorView'
import BookList from './BookList'

const BookListQuery = graphql`
  query BookListQuery($count: Int, $cursor:String) {
    viewer {
      ...BookList_viewer
    }
  }
`;

export default createQueryRenderer(
  BookList,
  {
    query: BookListQuery,
    variables: { count: 5 },
    LoadingView,
    ErrorView
  })