import React from 'react';
import ReactDOM from 'react-dom';
import { QueryRenderer } from 'react-relay';
import graphql from 'babel-plugin-relay/macro';

import './index.css';
import App from './App';


import * as serviceWorker from './serviceWorker';
import environment from './environment'

const HomeRendererQuery = graphql`
  query srcQuery {
    viewer {
      displayName
    }
  }
`;


ReactDOM.render(<QueryRenderer
  environment={environment}
  query={HomeRendererQuery}
  render={({ error, props }) => {
    if (error) {
      console.log(error);
      return <div>{error.message}</div>
    } else if (props) {
      return <div>{props.viewer.displayName}</div>
    }
    return <div>Loading...</div>
  }}
/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
