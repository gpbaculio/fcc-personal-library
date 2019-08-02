import React, { Fragment, Component } from 'react'
import { createFragmentContainer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';
import { ConnectionHandler } from 'relay-runtime'
import AddBook from './AddBook'
import BookList from './BookList';
import BookDeletedSubscription from '../subscriptions/bookDeleted'

export class Home extends Component {
  subscribeBookDeleted = () => BookDeletedSubscription({}, {
    updater: store => {
      const { viewer } = this.props
      const viewerProxy = store.get(viewer.id);
      const connection = ConnectionHandler.getConnection(
        viewerProxy,
        'Connection_BookList_viewer_books'
      )
      const subscriptionPayload = store.getRootField('bookDeleted');
      const deletedBookId = subscriptionPayload.getValue('deletedBookId')
      ConnectionHandler.deleteNode(connection, deletedBookId);
    }
  })
  componentDidMount() {
    this.deleteBookSubscription = this.subscribeBookDeleted().commit()
  }
  componentWillUnmount() {
    this.deleteBookSubscription.dispose()
  }
  render() {
    const { viewer } = this.props
    return (
      <Fragment>
        <AddBook viewer={viewer} />
        <BookList viewer={viewer} />
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
        profilePicture
        id
      }
    `
  }
)