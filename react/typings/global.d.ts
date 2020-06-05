import { OrderForm, Payment } from 'vtex.checkout-graphql'

declare global {
  interface MerchantTransaction {
    id: string
    transactionId: string
    merchantName: string
  }

  interface MerchantSellerPayment {
    id: string
    installments: number
    referenceValue: number
    value: number
    interestRate: number
    installmentValue: number
  }

  interface TransactionPayment extends Payment {
    merchantSellerPayments: MerchantSellerPayment[]
  }

  interface TransactionPaymentData extends OrderForm.paymentData {
    payments: TransactionPayment[]
  }

  interface TransactionResponse extends OrderForm {
    merchantTransactions: MerchantTransaction[]
    orderGroup: string
    receiverUri: string
    gatewayCallbackTemplatePath: string
    paymentData: TransactionPaymentData
  }

  interface GatewayPaymentTransaction {
    id: string
    merchantName: string
  }

  interface GatewayPayment extends TransactionPayment, MerchantSellerPayment {
    transaction: GatewayPaymentTransaction
    currencyCode: string
  }
}
