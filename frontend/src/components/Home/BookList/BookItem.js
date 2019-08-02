import React, { Component, Fragment } from 'react'
import { createRefetchContainer } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime';
import graphql from 'babel-plugin-relay/macro';
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import classNames from 'classnames'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap'

import { timeDifferenceForDate } from './utils'
import BookComments from './BookComments'
import UpdateBookTitleInput from './UpdateBookTitleInput';

import UpdateBookTitleMutation from '../../mutations/UpdateBookTitle'
import DeleteBookMutation from '../../mutations/DeleteBook'

import BookTitleUpdatedSubscription from '../../subscriptions/bookTitleUpdated'

class BookItem extends Component {
  state = {
    isEditingBook: false,
    deleteBookModal: false
  }
  subscribeBookTitleUpdated = bookId => BookTitleUpdatedSubscription({ bookId }, {
    updater: store => {
      const subscriptionPayload = store.getRootField('bookTitleUpdated');
      const bookEdge = subscriptionPayload.getLinkedRecord('book')
      const bookNode = bookEdge.getLinkedRecord('node')
      const newTitle = bookNode.getValue('title')
      const bookProxy = store.get(bookNode.getValue('id'))
      if (bookProxy)
        bookProxy.setValue(newTitle, 'title')
    }
  })
  componentDidUpdate(prevProps) {
    if (prevProps.book.id !== this.props.book.id) {
      this.bookTitleUpdatedSubscription.dispose()
      this.bookTitleUpdatedSubscription = this.subscribeBookTitleUpdated(this.props.book.id).commit()
    }
  }
  componentDidMount = () => {
    this.bookTitleUpdatedSubscription = this.subscribeBookTitleUpdated(this.props.book.id).commit()
  }
  componentWillUnmount = () => {
    this.bookTitleUpdatedSubscription.dispose()
  };
  setEditMode = isEditingBook => this.setState({ isEditingBook })
  onBookEditIconClick = () => this.setEditMode(true)
  onUpdateBookTitleSave = title => {
    const { book: { id: bookId }, cursor } = this.props
    this.setEditMode(false);
    const mutation = UpdateBookTitleMutation(
      { title, bookId },
      this.props.relay.environment,
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
  setDeleteBookModal = deleteBookModal => this.setState({ deleteBookModal })
  onDeleteBookConfirm = () => {
    const { book: { id: bookId }, viewer } = this.props
    const sharedUpdater = (viewerProxy, deletedBookId, viewerProxyBooksCount) => {
      if (viewerProxyBooksCount) viewerProxy.setValue(viewerProxyBooksCount - 1, 'booksCount')
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'Connection_BookList_viewer_books'
      );
      if (connection)
        ConnectionHandler.deleteNode(connection, deletedBookId);
      else
        console.log('Connection not found')
    }
    const mutation = DeleteBookMutation(
      { bookId },
      this.props.relay.environment,
      {
        updater: store => {
          const viewerProxy = store.get(viewer.id)
          const payload = store.getRootField('deleteBook');
          const viewerPayload = payload.getLinkedRecord('viewer')
          sharedUpdater(viewerProxy, payload.getValue('deletedBookId'), viewerPayload.getValue('booksCount'))
        },
        optimisticUpdater: store => {
          const viewerProxy = store.get(viewer.id)
          const viewerProxyBooksCount = viewerProxy.getValue('booksCount')
          sharedUpdater(viewerProxy, bookId, viewerProxyBooksCount)
        }
      })
    mutation.commit()
  }
  onDeleteBookIconClick = () => this.setState({ deleteBookModal: true })
  toggleDeleteBookModal = () => this.setState(({ deleteBookModal }) => ({ deleteBookModal: !deleteBookModal }))
  render() {
    const { book, viewer } = this.props;
    const { isEditingBook } = this.state
    return (
      <Fragment>
        <Modal isOpen={this.state.deleteBookModal} toggle={this.toggleDeleteBookModal}>
          <ModalHeader toggle={this.toggleDeleteBookModal}>Delete Book {book.title}</ModalHeader>
          <ModalBody>
            Please confirm to proceed.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onDeleteBookConfirm}>Confirm</Button>{' '}
            <Button color="secondary" onClick={() => this.setDeleteBookModal(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
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
                {!isEditingBook && book.owner.id === viewer.id && (
                  <div>
                    <FaEdit onClick={this.onBookEditIconClick} className='mr-2 btn-edit' />
                    <FaTrashAlt onClick={this.onDeleteBookIconClick} className='btn-delete' />
                  </div>
                )}
              </div>
              <p className={classNames('w-100 text-right m-0', { 'hide': !book.commentsCount })}>
                <small className='ml-auto'>{`${book.commentsCount} comment${book.commentsCount > 1 ? 's' : ''}`} </small>
              </p>
            </CardBody>
          </Card>
          <BookComments viewer={viewer} book={book} />
        </div>
      </Fragment>
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
