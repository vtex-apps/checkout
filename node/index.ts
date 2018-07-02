import {paymentConfiguration, settings, taxConfiguration, token} from './resolvers'

export default {
  graphql: {
    Query: {
      paymentConfiguration,
      settings,
      taxConfiguration,
      token,
    }
  }
}
