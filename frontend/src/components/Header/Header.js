import React, { Component } from 'react'
import { fromGlobalId } from 'graphql-relay'
import { withRouter } from 'react-router-dom'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';
import LoggedInView from './LoggedInView';
import GuestView from './GuestView';

export class Header extends Component {
  delayTimer = null
  state = { searchText: '', loading: false, showResult: true }
  handleChange = e => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value, showResult: true },
      async () => {
        const { searchText } = this.state
        if (searchText) {
          if (this.delayTimer) clearTimeout(this.delayTimer);
          this.setState({ loading: true })
          this.delayTimer = setTimeout(async () => {
            await this.refetch(searchText)
          }, 2000); // Will do the ajax stuff after 1000 ms, or 1 s

        }
      }
    );
  };
  refetch = searchText => {
    this.props.relay.refetch(
      { count: 6, searchText },
      null,
      () => this.setState({ loading: false })
    )
  }
  handleOnBlur = async (title, id) => {
    if (title) {
      await this.props.history.push(`/book/${fromGlobalId(id).id}`)
      this.setState({ showResult: false, searchText: title })
    }
    else
      this.setState({ showResult: false })
  }
  logout = () => {
    localStorage.removeItem('token')
    this.props.history.push('/')
  }
  render() {
    const { viewer } = this.props
    return viewer ? (
      <LoggedInView
        handleChange={this.handleChange}
        handleOnBlur={this.handleOnBlur}
        viewer={viewer}
        {...this.state}
      />
    ) : <GuestView />
  }
}

export const HeaderRFC = createRefetchContainer(
  withRouter(Header),
  graphql`
    fragment Header_viewer on User
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 5 },
        searchText: { type: "String", defaultValue: "" }
      ) {
      id
      username
      profilePicture
      books(first: $count, searchText: $searchText) @connection(key: "Header_books") {
        edges {
          cursor
          node {
            id
            title
          }
        }
      }
    }
  `,
  graphql`
    query HeaderRefetchQuery($count: Int!, $searchText: String!) {
      viewer {
        id
        ...Header_viewer @arguments(count: $count, searchText: $searchText)
      }
    }
  `
);
