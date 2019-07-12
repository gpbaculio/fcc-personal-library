import React, { Component } from 'react'
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
import { ConnectionHandler } from 'relay-runtime'
import uuidv1 from 'uuid/v1'

import addBook from '../mutations/AddBook';
import { booksUpdater } from './utils';

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
          booksUpdater(userProxy, payload.getLinkedRecord('book'));
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
    return (
      <div className='my-3 w-100 d-flex justify-content-center addbook-container p-3'>
        <Form onSubmit={this.addBook} inline className='d-flex w-50 justify-content-between'>
          <FormGroup className='flex-grow-1 mr-2'>
            <Label for="bookTitle" className='mr-2'>Book Title</Label>
            <Input
              value={bookTitle}
              onChange={this.handleChange}
              required
              className='flex-grow-1'
              type="text"
              name="bookTitle"
              id="bookTitle"
              placeholder="Book Title"
            />
          </FormGroup>
          <Button disabled={loading} type='submit' color='primary'>Add Book</Button>
        </Form>
      </div>
    )
  }
}

export default AddBook
