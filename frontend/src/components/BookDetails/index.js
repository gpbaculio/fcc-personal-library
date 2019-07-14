import React, { Component } from 'react'
import graphql from 'babel-plugin-relay/macro';
import { fetchQuery } from 'relay-runtime';
import { fromGlobalId } from 'graphql-relay'
import environment from '../Environment';

class BookDetails extends Component {
  componentDidMount() {
    const { bookId } = this.props.match.params
    const query = graphql`
      query BookDetailsQuery ($bookId: String, $count: Int, $cursor: String) {
        viewer { 
          book(bookId:$bookId) {
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
        }
      }
    `;

    const variables = {
      bookId: fromGlobalId(bookId).id,
      count: 3
    };
    console.log('variables ', variables)
    fetchQuery(environment, query, variables)
      .then(data => {
        // access the graphql response
        console.log('data ', data);
      });
  }

  render() {
    const { bookId } = this.props.match.params
    return (
      <div>
        {bookId}
      </div>
    )
  }
}

export default BookDetails