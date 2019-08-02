import React, { Component } from 'react'
import {
  Form,
  Input
} from 'reactstrap'
import uuidv1 from 'uuid/v1';
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay'

import CommentAddedSubscription from '../../subscriptions/commentAdded'
import { commentUpdater } from './utils';

import addComment from '../../mutations/AddComment';

class CommentInput extends Component {
  state = {
    commentText: ''
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.book.id !== this.props.book.id) {
      this.commentAddedSubscription.dispose()
      this.commentAddedSubscription = this.subscribeCommentAdded(this.props.book.id).commit()
    }
  }
  subscribeCommentAdded = bookId => CommentAddedSubscription({ bookId }, {
    updater: store => {
      const { book } = this.props
      const bookProxy = store.get(book.id)
      const payload = store.getRootField('commentAdded');
      const bookEdge = payload.getLinkedRecord('book')
      bookProxy.setValue(
        bookEdge.getLinkedRecord('node').getValue('commentsCount'),
        'commentsCount'
      )
      commentUpdater(bookProxy, payload.getLinkedRecord('comment'));
    }
  })

  componentDidMount = () => {
    this.commentAddedSubscription = this.subscribeCommentAdded(this.props.book.id).commit()
  }
  componentWillUnmount = () => {
    this.commentAddedSubscription.dispose()
  };
  addComment = e => {
    e.preventDefault();
    const { commentText } = this.state;
    const { viewer, book } = this.props
    this.setState({ loading: true });
    const mutation = addComment(
      { text: commentText, userId: viewer.id, bookId: book.id },
      this.props.relay.environment,
      {
        updater: store => {
          const bookProxy = store.get(book.id)
          const payload = store.getRootField('addComment');
          const bookEdge = payload.getLinkedRecord('book')
          bookProxy.setValue(
            bookEdge.getLinkedRecord('node').getValue('commentsCount'),
            'commentsCount'
          )
          commentUpdater(bookProxy, payload.getLinkedRecord('comment'));
          this.commentAddedSubscription = this.subscribeCommentAdded(book.id).commit()
        },
        optimisticUpdater: store => {
          this.commentAddedSubscription.dispose()
          const userProxy = store.get(viewer.id)
          const bookProxy = store.get(book.id)
          const bookProxyCommentsCount = bookProxy.getValue('commentsCount')
          bookProxy.setValue(bookProxyCommentsCount + 1, 'commentsCount')
          const username = userProxy.getValue('username')
          const profilePicture = userProxy.getValue('profilePicture')
          const commentId = uuidv1();
          const comment = store.create(commentId, 'Comment');
          comment.setValue(commentText, 'text');
          comment.setValue(commentId, 'id');
          const commentOwnerId = uuidv1()
          const commentOwner = store.create(commentOwnerId, 'CommentOwner');
          commentOwner.setValue(commentOwnerId, 'id')
          commentOwner.setValue(username, 'username')
          commentOwner.setValue(profilePicture, 'profilePicture')
          comment.setLinkedRecord(commentOwner, 'owner');
          comment.setValue(Date.now(), 'createdAt');
          const commentEdgeId = uuidv1()
          const commentEdge = store.create(commentEdgeId, 'CommentEdge');
          commentEdge.setLinkedRecord(comment, 'node');
          commentUpdater(bookProxy, commentEdge);
        },
        onCompleted: () => this.setState({ loading: false, commentText: '' }),
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
          autoComplete='off'
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

export default createFragmentContainer(
  CommentInput,
  {
    viewer: graphql`
      fragment CommentInput_viewer on User {
        id
      }
    `,
    book: graphql`
      fragment CommentInput_book on Book {
        id
      }
    `
  }
);
