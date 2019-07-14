import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import { Home, HomeFC } from './Home';
import ErrorView from './ErrorView'
import LoadingView from './LoadingView'

const HomeQR = createQueryRenderer(
  HomeFC,
  Home,
  {
    query: graphql`
      query HomeQuery($count: Int, $page: Int, $cursor: String) {
        viewer {
          id
          ...Home_viewer
        }
      }
    `,
    getFragmentProps: ({ viewer }) => ({
      viewer,
    }),
    variables: {},
    ErrorView: ErrorView,
    LoadingView: LoadingView,
  })

export default HomeQR