import React, { Component, Fragment } from 'react'
import { ConnectionHandler } from 'relay-runtime';
import { createFragmentContainer } from 'react-relay'
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import graphql from 'babel-plugin-relay/macro';
import classNames from 'classnames'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap'

import { timeDifferenceForDate } from './utils';
import UpdateCommentTextInput from './UpdateCommentTextInput';
import UpdateCommentTextMutation from '../../mutations/UpdateCommentText'
import DeleteCommentMutation from '../../mutations/DeleteComment'

import CommentTextUpdatedSubscription from '../../subscriptions/commentTextUpdated'
import CommentDeletedSubscription from '../../subscriptions/commentDeleted'

class Comment extends Component {
  state = {
    isEditingComment: false,
    deletModal: false
  }
  subscribeCommentTextUpdated = commentId => CommentTextUpdatedSubscription(
    { commentId },
    {
      updater: store => {
        const subscriptionPayload = store.getRootField('commentTextUpdated');
        const commentEdge = subscriptionPayload.getLinkedRecord('comment')
        const commentNode = commentEdge.getLinkedRecord('node')
        const newText = commentNode.getValue('text')
        const commentProxy = store.get(commentNode.getValue('id'))
        if (commentProxy)
          commentProxy.setValue(newText, 'text')
      }
    }
  )
  componentDidUpdate(prevProps) {
    if (prevProps.comment.id !== this.props.comment.id) {
      this.commentTextUpdatedSubscription.dispose()
      this.commentTextUpdatedSubscription = this.subscribeCommentTextUpdated(this.props.comment.id).commit()
    }
    if (prevProps.bookId !== this.props.bookId) {
      this.commentDeletedSubscription.dispose()
      this.commentDeletedSubscription = this.subscribeCommentDeleted(this.props.bookId).commit()
    }
  }
  componentDidMount = () => {
    this.commentDeletedSubscription = this.subscribeCommentDeleted(this.props.bookId).commit()
    this.commentTextUpdatedSubscription = this.subscribeCommentTextUpdated(this.props.comment.id).commit()
  }
  componentWillUnmount = () => {
    this.commentTextUpdatedSubscription.dispose()
    this.commentDeletedSubscription.dispose()
  };
  toggleDeleteModal = () => this.setState(({ deletModal }) => ({ deletModal: !deletModal }))
  onDeleteIconClick = () => this.setState({ deletModal: true })
  setDeleteModalMode = deletModal => this.setState({ deletModal })
  setEditMode = isEditingComment => this.setState({ isEditingComment })
  onCommentEditIconClick = () => this.setEditMode(true)
  onUpdateCommentTextSave = text => {
    const { comment: { id: commentId }, cursor } = this.props
    this.setEditMode(false);
    const mutation = UpdateCommentTextMutation(
      { commentId, text },
      this.props.relay.environment,
      {
        optimisticResponse: {
          updateCommentText: {
            comment: {
              __typename: 'CommentEdge',
              cursor,
              node: { id: commentId, text }
            },
          },
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  subscribeCommentDeleted = bookId => CommentDeletedSubscription({}, {
    updater: (store, response) => {
      const bookProxy = store.get(bookId);
      console.log('del response ', response)
      const connection = ConnectionHandler.getConnection(
        bookProxy,
        'BookComments_comments'
      )
      const subscriptionPayload = store.getRootField('commentDeleted');
      const deletedBookId = subscriptionPayload.getValue('deletedCommentId')
      if (deletedBookId)
        ConnectionHandler.deleteNode(connection, deletedBookId);
      const bookNodePayload = subscriptionPayload.getLinkedRecord('book').getLinkedRecord('node')
      if (bookNodePayload)
        bookProxy.setValue(bookNodePayload.getValue('commentsCount'), 'commentsCount')
    }
  })
  onDeleteCommentConfirm = async () => {
    const { comment: { id: commentId }, bookId } = this.props
    this.setDeleteModalMode(false);
    const sharedUpdater = (bookProxy, deletedCommentId) => {
      const connection = ConnectionHandler.getConnection(
        bookProxy,
        'BookComments_comments'
      );
      console.log('connection edges length', connection.getLinkedRecords('edges').length)
      if (connection)
        ConnectionHandler.deleteNode(connection, deletedCommentId);
      else
        console.log('Connection not found')
    }
    const mutation = DeleteCommentMutation(
      { bookId, commentId },
      this.props.relay.environment,
      {
        updater: async (store) => {
          const bookProxy = store.get(bookId)
          const payload = store.getRootField('deleteComment');
          const bookEdge = payload.getLinkedRecord('book')
          const bookNode = bookEdge.getLinkedRecord('node')
          const newBookCommentsCount = bookNode.getValue('commentsCount')
          bookProxy.setValue(newBookCommentsCount, 'commentsCount')
          const deletedCommentId = payload.getValue('deletedCommentId')
          console.log('deletedCommentId ', deletedCommentId);
          sharedUpdater(bookProxy, deletedCommentId)
          this.props.refetchedges()
        },
        optimisticUpdater: store => {
          const bookProxy = store.get(bookId)
          sharedUpdater(bookProxy, commentId)
          const bookProxyCommentsCount = bookProxy.getValue('commentsCount')
          if (bookProxyCommentsCount) bookProxy.setValue(bookProxyCommentsCount - 1, 'commentsCount')
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  render() {
    const { comment, viewer } = this.props
    const { isEditingComment } = this.state
    if (!comment) return null
    return (
      <Fragment>
        <Modal isOpen={this.state.deletModal} toggle={this.toggleDeleteModal}>
          <ModalHeader toggle={this.toggleDeleteModal}>Delete Comment {comment.text}</ModalHeader>
          <ModalBody>
            Please confirm to proceed.
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.onDeleteCommentConfirm}>Confirm</Button>{' '}
            <Button color="secondary" onClick={() => this.setDeleteModalMode(false)}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <li
          className={classNames(
            'comment d-flex w-100 my-1 justify-content-between align-items-center',
            { 'isEditingComment': isEditingComment }
          )}
          key={comment.id}
        >
          <div className='d-flex align-items-center'>
            <img
              alt=''
              src={`${process.env.PUBLIC_URL}/static/images/${comment.owner.profilePicture}`}
              width='35'
              height='35'
              className='mr-2'
            />
            <small className='font-weight-bold'>{comment.owner.username}</small>
          </div>
          {!!isEditingComment &&
            <UpdateCommentTextInput
              onSave={this.onUpdateCommentTextSave}
              commentText={comment.text}
            />}
          <div className='comment-info'>
            <small className='mr-2'>{comment.text} </small>
            <small>{timeDifferenceForDate(comment.createdAt)}</small>
          </div>
          {!isEditingComment && viewer.id === comment.owner.id && (
            <div>
              <FaEdit onClick={this.onCommentEditIconClick} className='mr-2 btn-edit' />
              <FaTrashAlt onClick={this.onDeleteIconClick} className='btn-delete' />
            </div>
          )}
        </li>
      </Fragment>
    )
  }
}

export default createFragmentContainer(Comment, {
  viewer: graphql`
    fragment Comment_viewer on User {
      id
    }`
  ,
  comment: graphql`
    fragment Comment_comment on Comment {
      id
      text
      owner {
        id
        username
        profilePicture
      }
      createdAt
    }
  `,
});

