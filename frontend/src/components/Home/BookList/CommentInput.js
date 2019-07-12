import React, { Component } from 'react'
import {
  Form,
  Input
} from 'reactstrap'
import uuidv1 from 'uuid/v1';

import addComment from '../../mutations/AddComment';
import { commentUpdater } from './utils';

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
        updater: (store) => {
          const bookProxy = store.get(bookId)
          const payload = store.getRootField('addComment');
          commentUpdater(bookProxy, payload.getLinkedRecord('comment'));
        },
        optimisticUpdater: (store) => {
          const userProxy = store.get(viewerId)
          const bookProxy = store.get(bookId)
          const owner = userProxy.getValue('username')
          const id = uuidv1();
          const comment = store.create(id, 'Comment');
          comment.setValue(commentText, 'text');
          comment.setValue(id, 'id');
          comment.setValue(owner, 'owner');
          comment.setValue(Date.now(), 'createdAt');
          const commentEdgeId = uuidv1()
          const commentEdge = store.create(commentEdgeId, 'CommentEdge');
          commentEdge.setLinkedRecord(comment, 'node');
          commentUpdater(bookProxy, commentEdge);
        },
        onCompleted: () => {
          this.setState({ loading: false, commentText: '' })
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
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
