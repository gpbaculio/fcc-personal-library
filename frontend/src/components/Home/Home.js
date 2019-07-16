import React, { Component, Fragment } from 'react'
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

export class Home extends Component {
  logout = () => {
    localStorage.removeItem('token')
    this.props.history.push(`/`)
  }
  render() {
    const { viewer } = this.props
    return (
      <Fragment>
        <Row>
          <Col>
            <div className='d-flex flex-column my-3 justify-content-center align-items-center'>
              {viewer ? (
                <Fragment>
                  <SubHeader viewer={viewer} username={viewer.username} />
                  <AddBook username={viewer.username} viewerId={viewer.id} />
                </Fragment>
              ) : <GuestView />}
            </div>
          </Col>
        </Row>
        <Row>
          <BookList viewer={viewer} />
        </Row>
      </Fragment>
    )
  }
}

export const HomeFC = createFragmentContainer(
  Home,
  {
    viewer: graphql`
      fragment Home_viewer on User {
        ...SubHeader_viewer
        ...BookList_viewer
        username
        id
      }
    `
  }
)