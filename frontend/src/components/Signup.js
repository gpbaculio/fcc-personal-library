import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { FaUserPlus } from 'react-icons/fa'
import signup from './mutations/signup';

export class Signup extends Component {
  state = {
    username: '',
    password: '',
    loading: false
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  _signUp = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    this.setState({
      loading: true
    });
    const mutation = signup(
      { username, password },
      {
        onSuccess: ({ userRegistration }) => {
          const { error, token } = userRegistration;
          let state = { signUpClicked: false, displayName: '', email: '', password: '', };
          if (!token && error) {
            state = {
              ...state,
              signUpError: true,
            }
          }
          this.setState({ ...state })
        },
        onFailure: transaction => this.setState({ signUpError: true, displayName: '', email: '', password: '', }),
      },
    );
    mutation.commit()
  }
  render() {
    const { username, password } = this.state
    return (
      <Container>
        <Row>
          <Col>
            <div className='form-container d-flex flex-column align-items-center justify-content-center'>
              <Card className='card-container'>
                <CardHeader className='d-inline-flex align-items-center'>
                  <FaUserPlus className='mr-1' /> Signup
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
                    <Button color='primary' type='submit' className='btn-block'>
                      Signup
                    </Button>
                    <small className='text-center form-text'>
                      Have an account? &nbsp;
                    <Link to='/login'>
                        Login
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

export default Signup

