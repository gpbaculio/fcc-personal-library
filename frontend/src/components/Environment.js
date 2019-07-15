import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import 'whatwg-fetch'

export const store = new Store(new RecordSource())

const getRequestBodyWithUploadables = (
  request,
  variables,
  uploadables,
) => {
  let formData = new FormData();
  formData.append('name', request.name);
  formData.append('query', request.text);
  formData.append('variables', JSON.stringify(variables));
  Object.keys(uploadables).forEach(key => {
    if (Object.prototype.hasOwnProperty
      .call(uploadables, key)) {
      formData.append(key, uploadables[key]);
    }
  });
  return formData;
};
const getRequestBodyWithoutUplodables = (
  request,
  variables,
) => {
  return JSON.stringify({
    query: request.text, // GraphQL text from input
    variables,
  });
}
const getRequestBody = (
  request,
  variables,
  uploadables
) => {
  if (uploadables) {
    return getRequestBodyWithUploadables(
      request,
      variables,
      uploadables
    );
  }
  return getRequestBodyWithoutUplodables(
    request,
    variables
  );
};
const getHeaders = uploadables => {
  if (uploadables) return { Accept: '*/*' };
  return { Accept: 'application/json', 'Content-type': 'application/json' };
};
const GRAPHQL_URL = 'http://localhost:8000/graphql'
const TOKEN_KEY = 'token';
const getToken = () => localStorage.getItem(TOKEN_KEY);
const fetchQuery = async (
  request,
  variables,
  _cacheConfig,
  uploadables
) => {
  const body = getRequestBody(request, variables, uploadables);

  const headers = {
    ...getHeaders(uploadables),
    Authorization: getToken(),
  };
  const response = await fetch(
    GRAPHQL_URL, {
      method: 'POST',
      credentials: 'same-origin',
      headers,
      body,
    });
  return await response.json();
};

export const network = Network.create(fetchQuery)

const environment = new Environment({ network, store })

export default environment
