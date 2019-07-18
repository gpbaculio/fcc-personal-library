import React, { Fragment } from 'react'
import {
  Container, Form, Input,
  Spinner, Button
} from 'reactstrap'
import { fromGlobalId } from 'graphql-relay'
import { Link } from 'react-router-dom'

const LoggedInVIew = ({
  searchText, loading, viewer,
  showResult, logout, handleChange,
  handleOnBlur
}) => {
  return (
    <Fragment>
      <header className='vw-100 py-2'>
        <h2 className='text-center'>ISQA Project - Personal Library</h2>
      </header>
      <Container>
        <div className='w-100 d-flex justify-content-between my-2 welcome-container p-3'>
          <Form className='d-flex w-50'>
            <div className='w-75 d-flex flex-column position-relative'>
              <Input
                autoComplete='off'
                value={searchText}
                onChange={handleChange}
                className='flex-grow-1'
                required
                type="text"
                name="searchText"
                id="search-book"
                placeholder="Search Books"
              />
              <div className='autocomplete-items'>
                {!loading && searchText && !viewer.books.edges.length && <div>Book does not exist</div>}
                {showResult && viewer.books.edges.map(({ node: { id, title } }) => {
                  const bookTitle = title.replace(new RegExp(searchText, 'g'), `<strong>${searchText}</strong>`);
                  return (
                    <div
                      key={id}
                      onClick={() => handleOnBlur(title, id)}
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
            <Link
              className='profile-link-container mr-3'
              to={`/profile/${fromGlobalId(viewer.id).id}`}
            >
              <img src={`${process.env.PUBLIC_URL}/images/${viewer.profilePicture}`} className="rounded mr-1" alt='' width='35' height='35' />
              <span>{viewer.username}</span>
            </Link>
            <Button onClick={logout} className='d-inline-block' color='primary'>Logout</Button>
          </div>
        </div>
      </Container>
    </Fragment>
  )
}

export default LoggedInVIew
