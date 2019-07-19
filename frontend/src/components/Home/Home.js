import React, { Component, Fragment } from 'react'
import { Row } from 'reactstrap'
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import AddBook from './AddBook';
import BookList from './BookList';

export class Home extends Component {
  logout = () => {
    localStorage.removeItem('token')
    this.props.history.push(`/`)
  }
  render() {
    const { viewer } = this.props
    return (
      <Fragment>
        <AddBook username={viewer.username} />
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
        ...BookList_viewer
        username
        id
      }
    `
  }
)