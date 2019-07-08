import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Card,
  CardHeader,
  CardBody
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { FaUserCheck, FaSignInAlt } from 'react-icons/fa';

export class Login extends Component {
  state = {
    username: '',
    password: ''
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  render() {
    const { username, password } = this.state
    return (
      <Container>
        <Row>
          <Col>
            <div className='form-container d-flex flex-column align-items-center justify-content-center'>
              <table className='mb-4'>
                <tbody>
                  <tr>
                    <th colSpan='2'>
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
              <Card className='card-container'>
                <CardHeader className='d-inline-flex align-items-center'>
                  <FaSignInAlt className='mr-1' />
                  Login
              </CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup>
                      <Label for="login-username">Username</Label>
                      <Input
                        type="text"
                        value={username}
                        onChange={this.handleChange}
                        name="username"
                        id="login-username"
                        placeholder="Username"
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="login-password">Password</Label>
                      <Input
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        name="password"
                        id="login-password"
                        placeholder="Password"
                      />
                    </FormGroup>
                    <Button color='primary' className='btn-block'>
                      Login
                  </Button>
                    <small className='text-center form-text'>
                      No account? &nbsp;
                      <Link to='/signup'>
                        Signup
                      </Link>
                    </small>
                  </Form>
                </CardBody>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default Login

