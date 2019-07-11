import React from 'react'
import graphql from 'babel-plugin-relay/macro';
import BookList from './BookList';
import createQueryRenderer from '../../createQueryRenderer';
import LoadingView from './LoadingView'

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
    loadingView: <LoadingView />
  })