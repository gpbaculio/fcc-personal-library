import React, { Component } from 'react'
import {
  Form,
  Input
} from 'reactstrap'

import addComment from '../../mutations/AddComment';

class CommentInput extends Component {
  state = {
    commentText: ''
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  addComment = e => {
    e.preventDefault();
    const { commentText } = this.state;
    const { viewerId, bookId } = this.props
    this.setState({ loading: true });
    const mutation = addComment(
      { text: commentText, userId: viewerId, bookId },
      {
        onCompleted: () => {
          this.setState({ loading: false, commentText: '' })
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit([
      {
        type: 'RANGE_ADD',
        parentID: bookId,
        connectionInfo: [
          {
            key: 'BookComments_comments',
            rangeBehavior: 'prepend'
          }
        ],
        edgeName: 'comment'
      }
    ])
  }
  render() {
    const { commentText } = this.state
    return (
      <Form onSubmit={this.addComment}>
        <Input
          value={commentText}
          onChange={this.handleChange}
          required
          className='flex-grow-1'
          type="text"
          name="commentText"
          id="commentText"
          placeholder="Write a comment..."
        />
      </Form>
    )
  }
}

export default CommentInput
