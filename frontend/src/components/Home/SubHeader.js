import React from 'react'
import {
  Button, Form, Input, FormGroup,
  Label
} from 'reactstrap'

const SubHeader = ({ username }) => {
  return (
    <div className='w-100 d-flex  justify-content-between my-2 welcome-container p-3'>
      <Form inline className='d-flex w-50'>
        <FormGroup className='w-100 d-flex'>
          <Label className='mr-2' for="search-book">Search Books</Label>
          <Input
            className='flex-grow-1'
            required
            type="text"
            name="bookTitle"
            id="search-book"
            placeholder="Search Books"
          />
        </FormGroup>
      </Form>
      <div>
        <span className='mr-3'>{username}</span>
        <Button color='primary'>Logout</Button>
      </div>
    </div>
  )
}

export default SubHeader
