import React from 'react'
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay'


export class BookDetails extends React.Component {

  render() {
    console.log('props ', this.props)

    return (
      <div>adasd</div>
    );
  }
}

export const BookDetailsFC = createFragmentContainer(
  BookDetails, {
    book: graphql`
    fragment BookDetails_book on Book 
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 3 }
        cursor: { type: "String", defaultValue: null }
      ) {
        id
        title
        owner
        createdAt
        comments(first: $count, after: $cursor) @connection(key: "BookDetails_comments",filters: []) { 
          edges {
            node {  
              id
              text
              owner
              createdAt
            }
          }
        }
      }
    `});