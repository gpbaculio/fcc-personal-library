import React, { Component } from 'react'
import {
  Button, Form, Input, FormGroup, Spinner
} from 'reactstrap'
import { Link } from 'react-router-dom'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';

class SubHeader extends Component {
  delayTimer = null
  state = {
    searchText: '',
    loading: false
  }
  handleChange = e => {
    const { name, value } = e.target;
    this.setState(
      { [name]: value },
      async () => {
        const { searchText } = this.state
        if (searchText) {
          if (this.delayTimer) clearTimeout(this.delayTimer);
          this.setState({ loading: true })
          this.delayTimer = setTimeout(() => {
            this.props.relay.refetch(
              { count: 6, searchText },
              null,
              () => this.setState({ loading: false })
            )
          }, 2000); // Will do the ajax stuff after 1000 ms, or 1 s

        }
      }
    );
  };
  render() {
    const { username, viewer } = this.props
    const { searchText, loading } = this.state
    return (
      <div className='w-100 d-flex justify-content-between my-2 welcome-container p-3'>
        <Form className='d-flex w-50'>
          <FormGroup className='w-75'>
            <div className='w-100 d-flex flex-column position-relative'>
              <Input
                value={searchText}
                onChange={this.handleChange}
                className='flex-grow-1'
                required
                type="text"
                name="searchText"
                id="search-book"
                placeholder="Search Books"
              />
              <div className='autocomplete-items'>
                {!loading && searchText && !viewer.SubHeader_viewer_books.edges.length && <div>Book does not exist</div>}
                {viewer.SubHeader_viewer_books.edges.map(({ node: { id, title } }) => {
                  const bookTitle = title.replace(
                    new RegExp(title, 'g'),
                    `<strong>${title}</strong>`
                  );
                  return (
                    <Link
                      key={id}
                      to={`/book/${id}`}
                      dangerouslySetInnerHTML={{ __html: `<div>${bookTitle}</div>` }}
                    />
                  );
                })}
                {loading && (
                  <div className='mx-auto d-flex justify-content-center'>
                    <Spinner color='info' className='mr-2' /> Loading...
                  </div>
                )}
              </div>
            </div>
          </FormGroup>
        </Form>
        <div>
          <span className='mr-3'>{username}</span>
          <Button color='primary'>Logout</Button>
        </div>
      </div>
    )
  }
}

export default createRefetchContainer(
  SubHeader,
  {
    viewer: graphql`
      fragment SubHeader_viewer on User
        @argumentDefinitions(
          count: { type: "Int" },
          searchText: { type: "String", defaultValue: "" }
        ) {
        id
        SubHeader_viewer_books: books(first: $count, searchText: $searchText)
          @connection(key: "Search_SubHeader_viewer_books") {
          edges {
            cursor
            node {
              id
              title
            }
          }
        }
      }
    `
  },
  graphql`
    query SubHeaderQuery($count: Int!, $searchText: String!) {
      viewer {
        id
        ...SubHeader_viewer @arguments(count: $count, searchText: $searchText)
      }
    }
  `
);