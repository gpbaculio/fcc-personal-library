import React, { Component } from 'react'
import { Input, Form } from 'reactstrap'


export default class UpdateBookTitleInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookTitle: props.bookTitle || ''
    };
  };
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  updateBookTitle = e => {
    e.preventDefault();
    this.props.onSave(this.state.bookTitle)
    this.setState({ bookTitle: '' })
  }
  render() {
    return (
      <Form onSubmit={this.updateBookTitle}>
        <Input
          autoComplete='off'
          value={this.state.bookTitle}
          onChange={this.handleChange}
          required
          className='flex-grow-1'
          type="text"
          name="bookTitle"
          id="bookTitle"
          placeholder="Write a comment..."
        />
      </Form>
    )
  }
}
