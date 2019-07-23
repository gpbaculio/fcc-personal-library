import React, { Component, Fragment } from 'react'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import { Card, CardHeader, CardBody } from 'reactstrap'
import { timeDifferenceForDate } from './utils'
import BookComments from './BookComments'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

class BookItem extends Component {
  render() {
    const { book, viewerId } = this.props;
    return (
      <div className='book-item mx-auto'>
        <Card>
          <CardHeader className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <img
                src={`${process.env.PUBLIC_URL}/images/${book.owner.profilePicture}`}
                className="rounded mr-1"
                alt=''
                width='35'
                height='35'
              />
              <p className='font-weight-bold m-0'>{book.owner.username}</p>
            </div>
            <span>{timeDifferenceForDate(book.createdAt)}</span>
          </CardHeader>
          <CardBody>
            <div className='d-flex w-100 justify-content-between'>
              <p>{book.title}</p>
              {book.owner.id === viewerId && (
                <div>
                  <FaEdit className='mr-2 btn-edit' />
                  <FaTrashAlt className='btn-delete' />
                </div>
              )}
            </div>
            <p className='w-100 text-right m-0'>
              <small className='ml-auto'>{book.commentsCount} comments</small>
            </p>
          </CardBody>
        </Card>
        <BookComments viewerId={viewerId} book={book} />
      </div>
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
        )  {
        id
        title
        commentsCount
        owner {
          id
          username
          profilePicture
        }
        createdAt
        ...BookComments_book 
      }
    `
  },
  graphql`
    query BookItemQuery($id: ID!, $count: Int, $cursor: String) {
      book: node(id: $id) {
        ...BookItem_book @arguments(count: $count, cursor: $cursor)
      }
    }
  `
);
