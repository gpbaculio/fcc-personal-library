import React, { Component } from 'react'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import { Card, CardHeader, CardBody } from 'reactstrap'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import classNames from 'classnames'

import { timeDifferenceForDate } from './utils'
import BookComments from './BookComments'
import UpdateBookTitleInput from './UpdateBookTitleInput';
import UpdateBookTitleMutation from '../../mutations/UpdateBookTitle'

class BookItem extends Component {
  state = { isEditingBook: false }
  setEditMode = isEditingBook => this.setState({ isEditingBook })
  onBookEditIconClick = () => this.setEditMode(true)
  onUpdateBookTitleSave = title => {
    const { book: { id: bookId }, cursor } = this.props
    this.setEditMode(false);
    const mutation = UpdateBookTitleMutation(
      { title, bookId },
      {
        optimisticResponse: {
          updateBookTitle: {
            book: {
              __typename: 'BookEdge',
              cursor,
              node: { id: bookId, title }
            },
          },
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  render() {
    const { book, viewer } = this.props;
    const { isEditingBook } = this.state
    const bookOwnerViewer = book.owner.id === viewer.id
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
            <div className={classNames('d-flex w-100 justify-content-between', { 'isEditingBook': isEditingBook })}>
              <p className='book-title'>{book.title}</p>
              {!!isEditingBook && <UpdateBookTitleInput onSave={this.onUpdateBookTitleSave} bookTitle={book.title} />}
              {!isEditingBook && bookOwnerViewer && (
                <div>
                  <FaEdit onClick={this.onBookEditIconClick} className='mr-2 btn-edit' />
                  <FaTrashAlt className='btn-delete' />
                </div>
              )}
            </div>
            <p className='w-100 text-right m-0'>
              <small className='ml-auto'>{book.commentsCount} comments</small>
            </p>
          </CardBody>
        </Card>
        <BookComments viewer={viewer} book={book} />
      </div>
    )
  }
}

export default createRefetchContainer(
  BookItem,
  {
    viewer: graphql`
      fragment BookItem_viewer on User {
        id
        ...BookComments_viewer
      }`
    ,
    book: graphql`
      fragment BookItem_book on Book
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "String", defaultValue: null }
        ) {
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
