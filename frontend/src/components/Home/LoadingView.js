import React from 'react';
import { Spinner } from 'reactstrap';

const LoadingView = () => (
  <div className='loading-view d-flex justify-content-center'>
    <div className='d-flex align-items-center'>
      <Spinner size='lg' className='m-auto loader' color='primary' />
      <span className='ml-2'>Loading...</span>
    </div>
  </div>
);

export default LoadingView;
