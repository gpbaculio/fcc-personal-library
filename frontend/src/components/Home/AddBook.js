import React, { Component } from 'react'
import {
  Form,
  Input
} from 'reactstrap'
import { ConnectionHandler } from 'relay-runtime'
import uuidv1 from 'uuid/v1'
import addBook from '../mutations/AddBook';

class AddBook extends Component {
  state = {
    bookTitle: '',
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  addBook = e => {
    e.preventDefault();
    const { bookTitle } = this.state;
    const { viewerId } = this.props
    this.setState({ loading: true });
    const mutation = addBook(
      { title: bookTitle, userId: viewerId },
      {
        updater: (store) => {
          const userProxy = store.get(viewerId)
          const payload = store.getRootField('addBook');
          const connection = ConnectionHandler.getConnection(
            userProxy,
            'Connection_BookList_viewer_books'
          );
          ConnectionHandler.insertEdgeBefore(
            connection,
            payload.getLinkedRecord('book')
          );
        },
        // optimisticUpdater: (store) => {
        //   const userProxy = store.get(viewerId)
        //   const id = uuidv1();
        //   const book = store.create(id, 'Book');
        //   book.setValue(id, 'id');
        //   book.setValue(bookTitle, 'title');
        //   book.setValue(Date.now(), 'createdAt');

        //   const bookOwner = store.create(uuidv1(), 'BookOwner')
        //   bookOwner.setValue(userProxy.getValue('id'), 'id')
        //   book.setLinkedRecord(bookOwner, 'owner')
        //   //comments
        //   const commentsId = uuidv1()
        //   const comments = store.create(commentsId, 'CommentConnection')
        //   comments.setLinkedRecords([], 'edges')
        //   const commentsProxy = store.get(commentsId)
        //   console.log('comments ', commentsProxy.getLinkedRecords('edges'))
        //   const pageInfo = store.create(uuidv1(), 'PageInfo')
        //   pageInfo.setValue(null, 'endCursor')
        //   pageInfo.setValue(false, 'hasNextPage')
        //   pageInfo.setValue(false, 'hasPreviousPage')
        //   pageInfo.setValue(null, 'startCursor')

        //   comments.setLinkedRecord(pageInfo, 'pageInfo')
        //   book.setLinkedRecord(comments, 'comments', { first: 3, cursor: null })

        //   const bookEdgeId = uuidv1()
        //   const bookEdge = store.create(bookEdgeId, 'BookEdge');
        //   bookEdge.setLinkedRecord(book, 'node');
        //   bookEdge.setValue(bookEdgeId, 'id')
        //   const connection = ConnectionHandler.getConnection(
        //     userProxy,
        //     'Connection_BookList_viewer_books'
        //   );
        //   ConnectionHandler.insertEdgeBefore(
        //     connection,
        //     bookEdge
        //   );
        // },
        onCompleted: () => {
          this.setState({ loading: false, bookTitle: '' })
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  render() {
    const { username } = this.props
    const { loading, bookTitle } = this.state
    if (!username) return null
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

export default AddBook
