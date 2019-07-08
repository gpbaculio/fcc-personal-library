import { commitMutation } from 'react-relay'

const mutationFromQuery = (query, env) => (input, callbacks) => ({
  commit: (configs) => commitMutation(env, {
    mutation: query,
    variables: { input },
    onError: callbacks.onFailure,
    onCompleted: callbacks.onSuccess,
    updater: callbacks.updater,
    optimisticUpdater: callbacks.optimisticUpdater,
    optimisticResponse: callbacks.optimisticResponse,
    uploadables: callbacks.uploadables,
    configs
  })
})

export default mutationFromQuery
