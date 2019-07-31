import { commitMutation } from 'react-relay'

const mutationFromQuery = query => (input, environment, callbacks) => ({
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
