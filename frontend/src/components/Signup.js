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
  Button,
  Alert
} from 'reactstrap'
import { Link } from 'react-router-dom'
import signup from './mutations/Signup';
import environment from './Environment';

export class Signup extends Component {
  state = {
    username: '',
    password: '',
    loading: false,
    message: '',
    alertVisible: false,
    error: false
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  signup = e => {
    e.preventDefault()
    const { username, password } = this.state;
    this.setState({ loading: true });
    const mutation = signup(
      { username, password },
      environment,
      {
        onCompleted: ({ signup }) => {
          let message = 'Signup successful', error = false;
          if (signup.error) {
            message = signup.error;
            error = true
          }
          this.setState({
            message,
            error,
            alertVisible: true,
            loading: false,
            username: '',
            password: ''
          })
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  closeAlert = () => {
    this.setState({ alertVisible: false, error: false, message: '' });
  };
  render() {
    const {
      username,
      password,
      error,
      alertVisible,
      message,
      loading
    } = this.state
    return (
      <Container>
        <Row>
          <Col>
            <div className='signup-frm-container d-flex flex-column align-items-center justify-content-center'>
              <Card className='card-container'>
                <CardHeader className='d-inline-flex align-items-center'>
                  Signup
                </CardHeader>
                <CardBody>
                  <Alert
                    className='mt-2'
                    color={error ? 'danger' : 'info'}
                    isOpen={alertVisible}
                    toggle={this.closeAlert}
                    fade={false}>
                    {message}
                  </Alert>
                  <Form onSubmit={this.signup}>
                    <FormGroup>
                      <Label for="login-username">Username</Label>
                      <Input
                        required={true}
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
                        required={true}
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        name="password"
                        id="login-password"
                        placeholder="Password"
                      />
                    </FormGroup>
                    <Button
                      disabled={loading}
                      color='primary'
                      type='submit'
                      className='btn-block'
                    >
                      Signup
                    </Button>
                    <small className='text-center form-text mt-2'>
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

