import React, { Component, Fragment } from 'react'
import { ConnectionHandler } from 'relay-runtime';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toGlobalId } from 'graphql-relay'
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

export default class Comment extends Component {
  state = {
    isEditingComment: false,
    deletModal: false
  }
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
  onDeleteCommentConfirm = () => {
    const { comment: { id: commentId }, bookId } = this.props
    this.setDeleteModalMode(false);
    const sharedUpdater = (bookProxy, deletedCommentId) => {
      const connection = ConnectionHandler.getConnection(
        bookProxy,
        'BookComments_comments'
      );
      if (connection)
        ConnectionHandler.deleteNode(connection, deletedCommentId);
      else
        console.log('Connection not found')
    }
    const mutation = DeleteCommentMutation(
      { bookId, commentId },
      {
        updater: store => {
          const bookProxy = store.get(bookId)
          const payload = store.getRootField('deleteComment');
          const bookEdge = payload.getLinkedRecord('book')
          const bookNode = bookEdge.getLinkedRecord('node')
          const newBookCommentsCount = bookNode.getValue('commentsCount')
          bookProxy.setValue(newBookCommentsCount, 'commentsCount')
          sharedUpdater(bookProxy, payload.getValue('deletedCommentId'))
        },
        optimisticUpdater: store => {
          const bookProxy = store.get(bookId)
          sharedUpdater(bookProxy, commentId)
          const bookProxyCommentsCount = bookProxy.getValue('commentsCount')
          if (bookProxyCommentsCount)
            bookProxy.setValue(bookProxyCommentsCount - 1, 'commentsCount')
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  render() {
    const { comment, viewerId } = this.props
    const { isEditingComment } = this.state
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
              src={`${process.env.PUBLIC_URL}/images/${comment.owner.profilePicture}`}
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
          {!isEditingComment && viewerId === comment.owner.id && (
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

