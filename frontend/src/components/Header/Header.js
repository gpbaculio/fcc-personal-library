import React, { Component, Fragment } from 'react'
import { fromGlobalId } from 'graphql-relay'
import { withRouter, Link } from 'react-router-dom'
import {
  Container, Form, Input,
  Spinner, Button
} from 'reactstrap'
import { createRefetchContainer } from 'react-relay'
import graphql from 'babel-plugin-relay/macro';

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
    const {
      viewer: {
        books, id, profilePicture,
        username
      }
    } = this.props
    const { id: userId } = fromGlobalId(id)
    const {
      searchText, loading, showResult
    } = this.state
    return (
      <Fragment>
        <header className='vw-100 py-2'>
          <h2 className='text-center'>ISQA Project - Personal Library</h2>
        </header>
        <Container>
          <div className='w-100 d-flex my-3 justify-content-between m welcome-container p-3'>
            <Form className='d-flex w-50'>
              <div className='w-75 d-flex flex-column position-relative'>
                <Input
                  autoComplete='off'
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
                  {!loading && searchText && !books.edges.length && <div>Book does not exist</div>}
                  {showResult && books.edges.map(({ node: { id, title } }) => {
                    const bookTitle = title.replace(new RegExp(searchText, 'g'), `<strong>${searchText}</strong>`);
                    return (
                      <div
                        key={id}
                        onClick={() => this.handleOnBlur(title, id)}
                        dangerouslySetInnerHTML={{ __html: `<span>${bookTitle}</span>` }}
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
            </Form>
            <div className='d-flex align-items-center'>
              {userId ? (
                <Fragment>
                  <Link
                    className='profile-link-container mr-3'
                    to={`/profile/${userId}`}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/${profilePicture}`}
                      className="rounded mr-1"
                      alt=''
                      width='35'
                      height='35'
                    />
                    <span>{username}</span>
                  </Link>
                  <button onClick={this.logout} className='btn btn-primary'>
                    Logout
                  </button>
                </Fragment>
              ) : (
                  <div className='d-flex'>
                    <Link className='nav-link btn-primary mr-3' to='/login'>
                      Login
                    </Link>
                    <Link className='nav-link btn-success' to='/signup'>
                      Signup
                  </Link>
                  </div>
                )}
            </div>
          </div>
        </Container>
      </Fragment>
    )
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
