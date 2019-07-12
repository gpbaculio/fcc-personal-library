import graphql from 'babel-plugin-relay/macro';
import createQueryRenderer from "../createQueryRenderer";
import Home from './Home';
import ErrorView from './ErrorView'
import LoadingView from './LoadingView'

const HomeQR = createQueryRenderer(
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
    variables: {},
    ErrorView: ErrorView,
    LoadingView: LoadingView,
  })

export default HomeQR