import React, { Component } from 'react'
import {
  Form,
  Input
} from 'reactstrap'
import { ConnectionHandler } from 'relay-runtime'

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
