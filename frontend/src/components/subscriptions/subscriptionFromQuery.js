import { requestSubscription } from 'react-relay'

import environment from '../Environment'

const subscriptionFromQuery = query => (input, callbacks) => ({
  commit(configs) {
    return requestSubscription(environment, {
      subscription: query,
      variables: input,
      onError: callbacks.onError,
      onCompleted: callbacks.onCompleted,
      onNext: callbacks.onNext,
      updater: callbacks.updater,
      configs
    })
  }
})

export default subscriptionFromQuery
