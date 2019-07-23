import React, { Component } from 'react'
import { timeDifferenceForDate } from './utils';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';


export default class Comment extends Component {
  render() {
    const { node, viewerId } = this.props
    return (
      <li
        className='comment d-flex w-100 my-1 justify-content-between align-items-center'
        key={node.id}
      >
        <div>
          <img
            alt=''
            src={`${process.env.PUBLIC_URL}/images/${node.owner.profilePicture}`}
            width='35'
            height='35'
            className='mr-2'
          />
          <small className='font-weight-bold'>{node.owner.username}</small>
        </div>
        <div>
          <small className='mr-2'>{node.text} </small>
          <small>{timeDifferenceForDate(node.createdAt)}</small>
        </div>
        {viewerId === node.owner.id && (
          <div>
            <FaEdit className='mr-2 btn-edit' />
            <FaTrashAlt className='btn-delete' />
          </div>
        )}
      </li>
    )
  }
}

