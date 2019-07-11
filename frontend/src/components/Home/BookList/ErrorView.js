import React from 'react';

const ErrorView = ({ error, retry }) => (
  <div className='d-flex justify-content-center'>
    <div>Error: {error} Please try <button onClick={() => retry()}>again</button></div>
  </div>
);

export default ErrorView;