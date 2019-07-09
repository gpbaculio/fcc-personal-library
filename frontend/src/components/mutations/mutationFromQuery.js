import { commitMutation } from 'react-relay'
import environment from '../../environment';

const mutationFromQuery = query => (input, callbacks) => ({
  commit: (configs) => commitMutation(environment, {
    mutation: query,
    variables: { input },
    onError: callbacks.onFailure,
    onCompleted: callbacks.onCompleted,
    updater: callbacks.updater,
    optimisticUpdater: callbacks.optimisticUpdater,
    optimisticResponse: callbacks.optimisticResponse,
    uploadables: callbacks.uploadables,
    configs
  })
})

export default mutationFromQuery
