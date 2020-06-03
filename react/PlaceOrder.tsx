import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { OrderForm } from 'vtex.order-manager'
import postRobot from 'post-robot'
import { useRuntime } from 'vtex.render-runtime'

const { useOrderForm } = OrderForm

const PlaceOrder: React.FC = () => {
  const { orderForm } = useOrderForm()
  const {
    culture: { currency },
    rootPath = '',
  } = useRuntime()

  const [placingOrder, setPlacingOrder] = useState(false)
  const [cardFormIframe] = useState(
    () => document.getElementById('chk-card-form')! as HTMLIFrameElement
  )

  const handlePlaceOrder = async () => {
    const referenceValue = orderForm.totalizers.reduce((total, totalizer) => {
      if (totalizer?.id === 'Tax' || totalizer?.id === 'interest') {
        return total
      }

      return total + (totalizer?.value ?? 0)
    }, 0)

    const value = orderForm.paymentData.payments.reduce(
      (total, payment) => total + (payment?.value ?? 0),
      0
    )

    const interestValue = orderForm.paymentData.payments.reduce(
      (total, payment) =>
        total + ((payment?.value ?? 0) - (payment?.referenceValue ?? 0)),
      0
    )

    const transactionData = {
      referenceId: orderForm.id,
      value,
      referenceValue,
      interestValue,
      savePersonalData: true,
      optinNewsLetter: false,
    }

    setPlacingOrder(true)

    const startTransactionResponse = await fetch(
      `${rootPath}/api/checkout/pub/orderForm/${orderForm.id}/transaction`,
      {
        method: 'post',
        body: JSON.stringify(transactionData),
        headers: {
          'content-type': 'application/json',
        },
      }
    )

    if (!startTransactionResponse.ok) {
      setPlacingOrder(false)
      return
    }

    const transaction = (await startTransactionResponse.json()) as TransactionResponse

    const {
      orderGroup: orderGroupId,
      id: transactionId,
      receiverUri,
      merchantTransactions,
      paymentData: { payments: transactionPayments },
      gatewayCallbackTemplatePath,
    } = transaction

    if (merchantTransactions?.length > 0) {
      const allPayments = transactionPayments.reduce<GatewayPayment[]>(
        (payments, transactionPayment) => {
          const merchantPayments = transactionPayment.merchantSellerPayments
            .map(merchantPayment => {
              const merchantTransaction = merchantTransactions.find(
                merchant => merchant.id === merchantPayment.id
              )

              if (!merchantTransaction) {
                return null
              }

              return {
                ...transactionPayment,
                ...merchantPayment,
                currencyCode: currency as string,
                transaction: {
                  id: merchantTransaction.transactionId,
                  merchantName: merchantTransaction.merchantName,
                },
              } as GatewayPayment
            })
            .filter(
              (merchantPayment): merchantPayment is GatewayPayment =>
                merchantPayment != null
            )

          return payments.concat(merchantPayments)
        },
        []
      )

      const { data: redirectUrl } = await postRobot.send(
        cardFormIframe.contentWindow,
        'sendPayments',
        {
          payments: allPayments,
          receiverUri,
          orderId: orderGroupId,
          gatewayCallbackTemplatePath,
          transactionId,
        }
      )

      const callbackResponse = await fetch(
        `${rootPath}/api/checkout/pub/gatewayCallback/${orderGroupId}`,
        { method: 'POST' }
      )

      if (callbackResponse.ok) {
        window.location.replace(redirectUrl)
      }
    } else if (!receiverUri) {
      // go to first invalid step
    } else if (transactionId === 'NO-PAYMENT') {
      window.location.href = receiverUri
    }
  }

  return (
    <div className="ph8-ns">
      <Button
        block
        size="large"
        onClick={handlePlaceOrder}
        disabled={placingOrder}
        isLoading={placingOrder}
      >
        <span className="f5">
          <FormattedMessage id="store/place-order-button" />
        </span>
      </Button>
    </div>
  )
}

export default PlaceOrder
