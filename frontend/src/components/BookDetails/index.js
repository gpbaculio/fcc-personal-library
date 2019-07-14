import React, { Component } from 'react'
import graphql from 'babel-plugin-relay/macro';
import { fromGlobalId } from 'graphql-relay'
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
          book(bookId:$bookId) {
            ...BookDetails_book
          }
        }
      }
    `,
    queriesParams: ({ match }) => ({
      bookId: fromGlobalId(match.params.bookId).id
    }),
    getFragmentProps: ({ viewer: { book } }) => ({
      book,
    }),
  }
)


export default BookDetailsQR