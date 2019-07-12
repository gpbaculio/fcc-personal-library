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
import BookList from './BookList';
import SubHeader from './SubHeader';

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
                  <SubHeader username={viewer.username} />
                  <AddBook username={viewer.username} viewerId={viewer.id} />
                </React.Fragment>
              ) : <GuestView />}
            </div>
          </Col>
        </Row>
        <Row>
          <BookList viewer={viewer} />
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
        ...BookList_viewer
        username
        id
      }
    `
  }
)