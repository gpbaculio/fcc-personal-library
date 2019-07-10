import React from 'react'

const ErrorView = ({ error, retry }) => {
  return (
    <div>
      Error! {error}. Please Try <button onClick={() => retry()}>again.</button>
    </div>
  )
}

export default ErrorView
