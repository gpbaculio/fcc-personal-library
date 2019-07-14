import React, { Component } from 'react'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import { Col, Card, CardHeader, CardBody, CardFooter } from 'reactstrap'
import { timeDifferenceForDate } from './utils'
import BookComments from './BookComments'

class BookItem extends Component {
  render() {
    const { book, viewerId, connectionKey } = this.props
    return (
      <Col xs='4' className='mb-4'>
        <Card>
          <CardHeader className='d-flex justify-content-between'>
            <span>{book.owner}</span>
            <span>{timeDifferenceForDate(book.createdAt)}</span>
          </CardHeader>
          <CardBody>
            {book.title}
          </CardBody>
          <CardFooter className='text-center'>
            Comment
          </CardFooter>
        </Card>
        <BookComments connectionKey={connectionKey} viewerId={viewerId} book={book} />
      </Col>
    )
  }
}

export default createRefetchContainer(
  BookItem,
  {
    book: graphql`
      fragment BookItem_book on Book
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "String", defaultValue: null }
        ) @relay(mask: false) {
        id
        title
        owner
        createdAt
        ...BookComments_book @relay(mask: false)
      }
    `
  },
  graphql`
    query BookItemQuery($id: ID!, $count: Int, $cursor: String) {
      book: node(id: $id) {
        ...BookItem_book @arguments(count: $count, cursor: $cursor) @relay(mask: false)
      }
    }
  `
);
