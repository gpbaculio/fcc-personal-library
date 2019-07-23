import React, { Component, Fragment } from 'react'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import { Card, CardHeader, CardBody } from 'reactstrap'
import { timeDifferenceForDate } from './utils'
import BookComments from './BookComments'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import EditBookTitle from './EditBookTitle';

class BookItem extends Component {
  state = {
    isEditing: false
  }
  toggleIsEditing = () => {
    this.setState(({ isEditing }) => ({ isEditing: !isEditing }))
  }
  render() {
    const { book, viewerId } = this.props;
    const { isEditing } = this.state
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
              {isEditing ?
                <EditBookTitle /> : <p>{book.title}</p>}
              {!isEditing && book.owner.id === viewerId && (
                <div>
                  <FaEdit onClick={this.toggleIsEditing} className='mr-2 btn-edit' />
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
