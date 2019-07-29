import React, { Fragment } from 'react'
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import AddBook from './AddBook';
import BookList from './BookList';

export const Home = ({ viewer }) => {
  return (
    <Fragment>
      <AddBook viewerId={viewer.id} profilePicture={viewer.profilePicture} username={viewer.username} />
      <BookList viewer={viewer} />
    </Fragment>
  )
}

export const HomeFC = createFragmentContainer(
  Home,
  {
    viewer: graphql`
      fragment Home_viewer on User {
        ...BookList_viewer
        username
        profilePicture
        id
      }
    `
  }
)