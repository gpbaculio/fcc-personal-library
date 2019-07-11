import * as React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { QueryRenderer } from 'react-relay';
import Environment from './Environment';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';

const createQueryRenderer = (
  Component,
  config,
) => {
  const { query, variables } = config;
  class QueryRendererWrapper extends React.Component {
    render() {
      return (
        <QueryRenderer
          environment={Environment}
          query={query}
          variables={variables}
          render={({ error, props, retry }) => {
            if (error) {
              return (
                <ErrorView
                  error={error}
                  retry={retry} />
              );
            }
            if (props) {
              return (
                <Component
                  {...this.props}
                  {...props}
                />
              );
            }
            if (config.loadingView !== undefined) {
              return config.loadingView;
            }
            return <LoadingView />
          }}
        />
      );
    }
  }

  return hoistStatics(QueryRendererWrapper, Component);
}

export default createQueryRenderer