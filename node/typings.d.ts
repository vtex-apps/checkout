declare module 'colossus' {
  import {Context as KoaContext} from 'koa'

  export interface IOContext {
    account: string
    workspace: string
    authToken: string
    params: {
      [param: string]: string
    }
    userAgent: string
    region: string
    route: string
  }

  export interface ColossusContext extends KoaContext {
    vtex: IOContext
  }
}

interface CheckoutSettings {
  paymentConfiguration: {
    requiresAuthenticationForPreAuthorizedPaymentOption: boolean
  },
  taxConfiguration: {
    url: string
    authorizationHeader: string
    allowExecutionAfterErrors: boolean
    integratedAuthentication: boolean
  },
  minimumQuantityAccumulatedForItems: number
  decimalDigitsPrecision: number
  minimumValueAccumulated: number
  allowMultipleDeliveries: boolean
  allowManualPrice: boolean
}
