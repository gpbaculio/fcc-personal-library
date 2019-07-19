import React from 'react';
import { Environment } from 'relay-runtime';
import hoistStatics from 'hoist-non-react-statics';
import { QueryRenderer } from 'react-relay';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';

import { store, network } from './Environment'

let environment = new Environment({ network, store })

export const logout = () => {
  environment = new Environment({ network, store })
}

export default function createQueryRenderer(
  FragmentComponent,
  Component,
  config
) {
  const { query, queriesParams } = config;
  class QueryRendererWrapper extends React.Component {
    render() {
      const variables = queriesParams
        ? queriesParams(this.props) :
        config.variables;
      return (
        <QueryRenderer
          environment={environment}
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
              const fragmentProps = config.getFragmentProps
                ? config.getFragmentProps(props)
                : { query: props };
              console.log('this.props ', this.props)
              console.log('fragmentProps ', fragmentProps)
              return (
                <FragmentComponent
                  {...this.props}
                  {...fragmentProps}
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
