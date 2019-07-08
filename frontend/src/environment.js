import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import 'whatwg-fetch'

export const store = new Store(new RecordSource())

const fetchQuery = (operation, variables) => {
  return fetch('http://localhost:8000/graphql', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token'), // we are using token from the response when user successfully logged in
    },
    body: JSON.stringify({ query: operation.text, variables })
  }).then(response => {
    // A better error message for request timeouts
    if (response.status === 504) {
      return Promise.reject({
        error: {
          message: 'Request timed out'
        }
      })
    }
    return response.json()
  }).then(responseJson => {
    // https://github.com/facebook/relay/issues/1816
    // https://github.com/facebook/relay/issues/1913
    if (responseJson.errors) {
      return Promise.reject(responseJson.errors[0])
    }
    return Promise.resolve(responseJson)
  })
}

export const network = Network.create(fetchQuery)

const environment = new Environment({ network, store })

export default environment
