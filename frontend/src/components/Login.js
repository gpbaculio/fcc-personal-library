import React, { Component } from 'react'
import {
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
import login from './mutations/Login';
import environment from './Environment';

export class Login extends Component {
  state = {
    username: '',
    password: ''
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }
  login = e => {
    e.preventDefault();
    const { username, password } = this.state;
    this.setState({ loading: true });
    const mutation = login(
      { username, password },
      environment,
      {
        onCompleted: ({ login: { token, error } }) => {
          if (error) {
            this.setState({
              message: error,
              error,
              alertVisible: true,
              loading: false,
              username: '',
              password: ''
            })
          }
          if (token) {
            localStorage.setItem('token', token)
            this.props.history.push('/home');
          }
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
    const { username, password, loading } = this.state
    return (
      <div className='login-frm-container d-flex flex-column align-items-center justify-content-center'>
        <table className='mb-4'>
          <tbody>
            <tr>
              <th colSpan='2'>
                <div className='d-inline-flex align-items-center'>
                  Login with test acount
                    </div>
              </th>
            </tr>
            <tr>
              <td>username: gpbaculio2019 </td>
              <td>password: abcd123</td>
            </tr>
          </tbody>
        </table>
        <Card className='card-container'>
          <CardHeader className='d-inline-flex align-items-center'>
            Login
              </CardHeader>
          <CardBody>
            <Form onSubmit={this.login}>
              <FormGroup>
                <Label for="login-username">Username</Label>
                <Input
                  required
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
                  required
                  type="password"
                  value={password}
                  onChange={this.handleChange}
                  name="password"
                  id="login-password"
                  placeholder="Password"
                />
              </FormGroup>
              <Button disabled={loading} type='submit' color='primary' className='btn-block'>
                Login
              </Button>
              <small className='text-center form-text mt-2'>
                No account? &nbsp;
                <Link to='/signup'>
                  Signup
                </Link>
              </small>
            </Form>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default Login

