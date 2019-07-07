import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'
const Home = () => {
  return (
    <Container>
      <Row>
        <Col>
          <div className='d-flex flex-column my-3 justify-content-center align-items-center'>
            <h5 className='my-3'>
              Please login to add book(s) and comment
            </h5>
            <table className='my-2'>
              <tr>
                <th colSpan='2'>Login with test acount</th>
              </tr>
              <tr>
                <td>username: gpbaculio </td>
                <td>password: abcd123</td>
              </tr>
            </table>
            <div className='d-flex w-25 justify-content-around my-3 align-items-center'>
              <Link className='nav-link' to='/login'>
                <Button color='primary'>
                  Login
                </Button>
              </Link>
              <Link className='nav-link' to='/signup'>
                <Button color='success'>
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <hr />
    </Container>
  )
}

export default Home
