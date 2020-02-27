interface CheckoutSettings {
  paymentConfiguration: {
    requiresAuthenticationForPreAuthorizedPaymentOption: boolean
  }
  taxConfiguration: {
    url: string
    authorizationHeader: string
    allowExecutionAfterErrors: boolean
    integratedAuthentication: boolean
  }
  minimumQuantityAccumulatedForItems: number
  decimalDigitsPrecision: number
  minimumValueAccumulated: number
  allowMultipleDeliveries: boolean
  allowManualPrice: boolean
}
