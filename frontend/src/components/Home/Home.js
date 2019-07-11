import React, { Component } from 'react'
import {
  Container,
  Row,
  Col,
} from 'reactstrap'
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import GuestView from './GuestView';
import AddBook from './AddBook';
import BookListContainer from './BookList';

class Home extends Component {
  logout = () => {
    localStorage.removeItem('token')
    this.props.history.push(`/`)
  }
  render() {
    const { viewer } = this.props
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
                  <AddBook viewerId={viewer.id} />
                </React.Fragment>
              ) : <GuestView />}
            </div>
          </Col>
        </Row>
        <Row>
          <BookListContainer viewer={viewer} />
        </Row>
      </Container>
    )
  }
}

export default createFragmentContainer(
  Home,
  {
    viewer: graphql`
      fragment Home_viewer on User {
        ...BookListContainer_viewer
        username
        id
      }
    `
  }
)