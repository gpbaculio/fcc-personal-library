import React, { Component } from 'react'
import { timeDifferenceForDate } from './utils';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import EditCommentTextInput from './EditCommentTextInput';


export default class Comment extends Component {
  state = {
    isEditing: false
  }
  toggleIsEditing = () => {
    this.setState(({ isEditing }) => ({ isEditing: !isEditing }))
  }
  render() {
    const { node, viewerId } = this.props
    const { isEditing } = this.state
    return (
      <li
        className='comment d-flex w-100 my-1 justify-content-between align-items-center'
        key={node.id}
      >
        <div className='d-flex align-items-center'>
          <img
            alt=''
            src={`${process.env.PUBLIC_URL}/images/${node.owner.profilePicture}`}
            width='35'
            height='35'
            className='mr-2'
          />
          <small className='font-weight-bold'>{node.owner.username}</small>
        </div>
        {isEditing ?
          <EditCommentTextInput /> : (
            <div>
              <small className='mr-2'>{node.text} </small>
              <small>{timeDifferenceForDate(node.createdAt)}</small>
            </div>
          )}
        {!isEditing && viewerId === node.owner.id && (
          <div>
            <FaEdit onClick={this.toggleIsEditing} className='mr-2 btn-edit' />
            <FaTrashAlt className='btn-delete' />
          </div>
        )}
      </li>
    )
  }
}

