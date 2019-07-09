import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'
import { FaSignInAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa'
const Home = ({ viewer }) => {
  return (
    <Container>
      <Row>
        <Col>
          <div className='d-flex flex-column my-3 justify-content-center align-items-center'>
            {viewer ? (
              <React.Fragment>
                <div className='w-100 d-flex my-2 py-2 welcome-container'>
                  <h4>{viewer.username}</h4>
                </div>
              </React.Fragment>
            ) : (
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
                        <FaSignInAlt className='mr-1' /> Login
                  </Button>
                    </Link>
                    <Link className='nav-link' to='/signup'>
                      <Button color='success' className='d-inline-flex align-items-center justify-content-between'>
                        <FaUserPlus className='mr-1' />  Signup
                  </Button>
                    </Link>
                  </div>
                  <hr />
                </React.Fragment>
              )}
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
