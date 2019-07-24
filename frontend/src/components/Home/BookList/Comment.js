import React, { Component } from 'react'
import { timeDifferenceForDate } from './utils';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import UpdateCommentTextInput from './UpdateCommentTextInput';
import UpdateCommentTextMutation from '../../mutations/UpdateCommentText'

export default class Comment extends Component {
  state = {
    isEditingComment: false
  }
  setEditMode = isEditingComment => this.setState({ isEditingComment })
  onCommentEditIconClick = () => this.setEditMode(true)
  onUpdateBookTitleSave = text => {
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
  render() {
    const { comment, viewerId } = this.props
    const { isEditingComment } = this.state
    return (
      <li
        className='comment d-flex w-100 my-1 justify-content-between align-items-center'
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
        {isEditingComment ?
          <UpdateCommentTextInput
            onSave={this.onUpdateBookTitleSave}
            commentText={comment.text}
          /> : (
            <div>
              <small className='mr-2'>{comment.text} </small>
              <small>{timeDifferenceForDate(comment.createdAt)}</small>
            </div>
          )}
        {!isEditingComment && viewerId === comment.owner.id && (
          <div>
            <FaEdit onClick={this.onCommentEditIconClick} className='mr-2 btn-edit' />
            <FaTrashAlt className='btn-delete' />
          </div>
        )}
      </li>
    )
  }
}

