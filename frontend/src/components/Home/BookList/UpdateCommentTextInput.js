import React, { Component } from 'react'
import { Input, Form } from 'reactstrap'


export default class UpdateBookTitleInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentText: props.commentText || ''
    };
  };
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  updateCommentText = e => {
    e.preventDefault();
    this.props.onSave(this.state.commentText)
    this.setState({ commentText: '' })
  }
  render() {
    return (
      <Form onSubmit={this.updateCommentText}>
        <Input
          autoComplete='off'
          value={this.state.commentText}
          onChange={this.handleChange}
          required
          className='flex-grow-1'
          type="text"
          name="commentText"
          id="comment-text"
          placeholder="Write a comment..."
        />
      </Form>
    )
  }
}
