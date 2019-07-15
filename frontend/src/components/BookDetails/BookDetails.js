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
          <BookItem viewerId={viewerId} key={book.id} book={book} />
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
      ) {
        ...BookItem_book
        ...BookComments_book
      }
    `});