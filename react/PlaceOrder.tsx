import React, { useState, useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import { OrderForm } from 'vtex.order-manager'
import postRobot from 'post-robot'
import { useRuntime } from 'vtex.render-runtime'
import { OrderPayment } from 'vtex.order-payment'

const { useOrderForm } = OrderForm
const { useOrderPayment } = OrderPayment

const PlaceOrder: React.FC = () => {
  const { orderForm } = useOrderForm()
  const {
    paymentSystems,
    value,
    referenceValue,
    interestValue,
  } = useOrderPayment()
  const {
    culture: { currency },
    rootPath = '',
  } = useRuntime()

  const [placingOrder, setPlacingOrder] = useState(false)
  const [cardFormIframe] = useState(
    () => document.getElementById('chk-card-form')! as HTMLIFrameElement
  )

  const paymentSystemsWithSensitiveData = useMemo(
    () =>
      paymentSystems
        .filter(
          paymentSystem => paymentSystem.groupName === 'creditCardPaymentGroup'
        )
        .map(({ id }) => id),
    [paymentSystems]
  )

  const handlePlaceOrder = async () => {
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

      const hasSensitiveData = allPayments.some(payment =>
        paymentSystemsWithSensitiveData.includes(payment.paymentSystem!)
      )

      let redirectUrl

      if (hasSensitiveData) {
        const { data } = await postRobot.send(
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

        redirectUrl = data
      } else {
        const paymentsResponse = await fetch(
          `${rootPath}/api/payments/pub/transactions/${transactionId}/payments?orderId=${orderGroupId}`,
          {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(allPayments),
          }
        )

        if (paymentsResponse.status === 201) {
          redirectUrl = gatewayCallbackTemplatePath.replace(
            '{messageCode}',
            'Success'
          )
        } else {
          setPlacingOrder(false)
          // TODO: show error message
          return
        }
      }

      const callbackResponse = await fetch(
        `${rootPath}/api/checkout/pub/gatewayCallback/${orderGroupId}`,
        { method: 'POST' }
      )

      if (callbackResponse.ok) {
        window.location.replace(redirectUrl)
      }
    } else if (!receiverUri) {
      // TODO: go to first invalid step
      setPlacingOrder(false)
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
