import { commitMutation } from 'react-relay'

import environment from '../Environment'

const mutationFromQuery = query => (input, env, callbacks) => ({
  commit: (configs) => commitMutation(env || environment, {
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
