import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { FaSignInAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa'

const GuestView = () => {
  return (
    <React.Fragment>
      <h5 className='my-3'>
        Please login to add book(s) and comment
      </h5>
      <table className='my-2'>
        <tbody>
          <tr>
            <th colSpan='2' valign='center'>
              <div className='d-inline-flex align-items-center'>
                <FaUserCheck className='mr-1 ' />
                Login with test acount
              </div>
            </th>
          </tr>
          <tr>
            <td>username: gpbaculio </td>
            <td>password: abcd123</td>
          </tr>
        </tbody>
      </table>
      <div className='d-flex w-25 justify-content-around my-3 align-items-center'>
        <Link className='nav-link' to='/login'>
          <Button color='primary' className='d-inline-flex align-items-center justify-content-between'>
            <FaSignInAlt className='mr-1' />
            Login
          </Button>
        </Link>
        <Link className='nav-link' to='/signup'>
          <Button color='success' className='d-inline-flex align-items-center justify-content-between'>
            <FaUserPlus className='mr-1' />
            Signup
          </Button>
        </Link>
      </div>
      <hr />
    </React.Fragment>
  )
}

export default GuestView
