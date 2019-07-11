import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = () => (
  <div className='d-flex justify-content-center'>
    <div className='d-flex align-items-center'>
      <Spinner size='lg' className='m-auto loader' color='primary' />
      <span className='ml-2'>Fetching books...</span>
    </div>
  </div>
);

export default Loader;
