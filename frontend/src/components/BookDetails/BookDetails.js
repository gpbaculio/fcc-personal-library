import React from 'react'
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay'
import { Container, Col, Row } from 'reactstrap'
import BookItem from '../Home/BookList/BookItem';

export class BookDetails extends React.Component {
  render() {
    const { book, viewerId } = this.props
    return (
      <Container>
        <Row>
          <BookItem connectionKey={'BookDetails_comments'} viewerId={viewerId} key={book.id} book={book} />
        </Row>
      </Container>
    );
  }
}

export const BookDetailsFC = createFragmentContainer(
  BookDetails, {
    book: graphql`
    fragment BookDetails_book on Book 
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 3 }
        cursor: { type: "String", defaultValue: null }
      ) @relay(mask: false) {
        id
        title
        owner
        createdAt
        comments(first: $count, after: $cursor) @connection(key: "BookDetails_comments",filters: []) @relay(mask: false) { 
          edges {
            node {  
              id
              text
              owner
              createdAt
            }
          }
        }
      }
    `});