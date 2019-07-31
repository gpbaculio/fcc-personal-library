import React, { PureComponent } from 'react'
import {
  Form,
  Input
} from 'reactstrap'
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'

import uuidv1 from 'uuid/v1'
import addBook from '../../mutations/AddBook';

import BookAddedSubscription from '../../subscriptions/bookAdded'

export class AddBook extends PureComponent {
  state = {
    bookTitle: '',
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  subscribeBookAdded = () => BookAddedSubscription({}, {
    updater: store => {
      const { viewer } = this.props
      const viewerProxy = store.get(viewer.id);
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'Connection_BookList_viewer_books'
      )
      const subscriptionPayload = store.getRootField('bookAdded');
      const bookEdge = subscriptionPayload.getLinkedRecord('book')
      const newEdge = ConnectionHandler.createEdge(
        store,
        connection,
        bookEdge.getLinkedRecord('node'),
        'BookEdge',
      );
      ConnectionHandler.insertEdgeBefore(connection, newEdge);
    }
  })
  componentDidMount = () => {
    this.bookAddedSubscription = this.subscribeBookAdded().commit()
  }
  componentWillUnmount = () => {
    this.bookAddedSubscription.dispose()
  };
  addBook = e => {
    e.preventDefault();
    const { bookTitle } = this.state;
    const { viewer } = this.props
    this.setState({ loading: true });
    const mutation = addBook(
      { title: bookTitle, userId: viewer.id },
      this.props.relay.environment,
      {
        updater: store => {
          const viewerProxy = store.getRoot().getLinkedRecord('viewer');
          const payload = store.getRootField('addBook');
          const bookEdge = payload.getOrCreateLinkedRecord('book')
          const connection = ConnectionHandler.getConnection(
            viewerProxy,
            'Connection_BookList_viewer_books'
          )
          const node = bookEdge.getLinkedRecord('node')
          const newEdge = ConnectionHandler.createEdge(
            store,
            connection,
            node,
            'BookEdge',
          );
          ConnectionHandler.insertEdgeBefore(connection, newEdge);
          this.bookAddedSubscription = this.subscribeBookAdded(this.props.viewer.id).commit()
        },
        optimisticUpdater: (store) => {
          this.bookAddedSubscription.dispose()
          const userProxy = store.get(viewer.id)
          const id = uuidv1();
          const book = store.create(id, 'Book');
          book.setValue(id, 'id');
          book.setValue(bookTitle, 'title');
          book.setValue(Date.now(), 'createdAt');
          book.setValue(0, 'commentsCount');

          const bookOwner = store.create(uuidv1(), 'BookOwner')
          bookOwner.setValue(userProxy.getValue('id'), 'id')
          bookOwner.setValue(userProxy.getValue('username'), 'username')
          bookOwner.setValue(userProxy.getValue('profilePicture'), 'profilePicture')
          book.setLinkedRecord(bookOwner, 'owner')

          const bookEdgeId = uuidv1()
          const bookEdge = store.create(bookEdgeId, 'BookEdge');
          bookEdge.setLinkedRecord(book, 'node');
          bookEdge.setValue(bookEdgeId, 'id')
          const connection = ConnectionHandler.getConnection(
            userProxy,
            'Connection_BookList_viewer_books'
          );
          ConnectionHandler.insertEdgeBefore(
            connection,
            bookEdge
          );
        },
        onCompleted: () => {
          this.setState({ loading: false, bookTitle: '' })
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  render() {
    const { loading, bookTitle } = this.state
    const { viewer } = this.props
    if (!viewer.username) return null
    return (
      <div className='mb-4 w-100 d-flex justify-content-center addbook-container py-3'>
        <Form onSubmit={this.addBook} inline className='d-flex'>
          <Input
            value={bookTitle}
            onChange={this.handleChange}
            required
            className='flex-grow-1 mr-2'
            type="text"
            name="bookTitle"
            id="bookTitle"
            placeholder="Book Title"
          />
          <button disabled={loading} type='submit' className='btn btn-primary'>Add</button>
        </Form>
      </div>
    )
  }
}

export const AddBookFC = createFragmentContainer(
  AddBook,
  {
    viewer: graphql`
      fragment AddBook_viewer on User {
        id
        profilePicture
        username
      }
    `
  }
);