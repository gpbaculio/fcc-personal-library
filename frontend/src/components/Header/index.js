import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import { Header, HeaderRFC } from './Header';

const HeaderQR = createQueryRenderer(
  HeaderRFC,
  Header,
  {
    query: graphql`
      query HeaderQuery($count: Int!, $searchText: String!) {
        viewer {
          id
          username
          ...Header_viewer @arguments(count: $count, searchText: $searchText)
        }
      }
    `,
    getFragmentProps: ({ viewer }) => ({
      viewer
    }),
    variables: { count: 5, searchText: '' },
  }
);

//<SubHeader viewer={viewer} username={viewer.username} />

export default HeaderQR