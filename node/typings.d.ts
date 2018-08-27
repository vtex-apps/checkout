import { Apps, IOContext } from "@vtex/api"
import {Context as KoaContext} from 'koa'

declare global {
  interface ColossusContext extends KoaContext {
    vtex: IOContext
    apps: Apps
  }

  interface Settings {
    taxConfiguration: TaxConfiguration
    paymentConfiguration: PaymentConfiguration
    minimumQuantityAccumulatedForItems: number
    decimalDigitsPrecision: number
    minimumValueAccumulated: number
    apps: [App]
    allowMultipleDeliveries: boolean
    allowManualPrice: boolean
  }

  interface App {
    fields: [string]
    id: string
    major: number
  }

  interface TaxConfiguration {
    allowExecutionAfterErrors: boolean
    authorizationHeader: string
    integratedAuthentication: boolean
    url: string
  }

  interface PaymentConfiguration {
    requiresAuthenticationForPreAuthorizedPaymentOption: boolean
  }
}

export {}
