import React, { useState, useMemo } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Alert } from 'vtex.styleguide'
import { OrderForm } from 'vtex.order-manager'
import postRobot from 'post-robot'
import { useRuntime } from 'vtex.render-runtime'
import { OrderPayment } from 'vtex.order-payment'

const { useOrderForm } = OrderForm
const { useOrderPayment } = OrderPayment

const getCardFormIframe = (() => {
  let iframe: HTMLIFrameElement | null = null

  return (): HTMLIFrameElement => {
    if (!iframe) {
      iframe = document.getElementById('chk-card-form')! as HTMLIFrameElement
    }

    return iframe
  }
})()

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

  const intl = useIntl()

  const [placingOrder, setPlacingOrder] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    setErrorMessage(null)

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

    if (transactionId === 'NO-PAYMENT') {
      window.location.replace(receiverUri)
      return
    }

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

              const { merchantSellerPayments, ...payment } = transactionPayment

              return {
                ...payment,
                ...merchantPayment,
                currencyCode: currency as string,
                installmentsValue: merchantPayment.installmentValue,
                installmentsInterestRate: merchantPayment.interestRate,
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

      let redirectUrl

      const hasSensitiveData = allPayments.some(payment =>
        paymentSystemsWithSensitiveData.includes(payment.paymentSystem!)
      )

      if (hasSensitiveData) {
        try {
          const { data: url } = await postRobot.send(
            getCardFormIframe().contentWindow,
            'sendPayments',
            {
              payments: allPayments,
              receiverUri,
              orderId: orderGroupId,
              gatewayCallbackTemplatePath,
              transactionId,
            }
          )

          redirectUrl = url
        } catch (err) {
          setPlacingOrder(false)
          setErrorMessage(
            intl.formatMessage({
              id: 'store/place-order.generic-error-message',
            })
          )
          return
        }
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
          setErrorMessage(
            intl.formatMessage({
              id: 'store/place-order.generic-error-message',
            })
          )
          return
        }
      }

      const callbackResponse = await fetch(
        `${rootPath}/api/checkout/pub/gatewayCallback/${orderGroupId}`,
        { method: 'POST' }
      )

      if (callbackResponse.ok) {
        window.location.replace(redirectUrl)
      } else {
        setPlacingOrder(false)
        setErrorMessage(
          intl.formatMessage({
            id: 'store/place-order.gateway-response-error-message',
          })
        )
        return
      }
    } else if (!receiverUri) {
      setPlacingOrder(false)
      setErrorMessage(
        intl.formatMessage({ id: 'store/place-order.generic-error-message' })
      )
    } else if (transactionId === 'NO-PAYMENT') {
      window.location.href = receiverUri
    }
  }

  return (
    <div className="ph8-ns">
      {errorMessage && (
        <div className="mb6 mb7-ns">
          <Alert
            type="error"
            focusOnEnter
            onClose={() => setErrorMessage(null)}
            closeIconLabel={intl.formatMessage({
              id: 'store/place-order.close-error-alert-label',
            })}
          >
            {errorMessage}
          </Alert>
        </div>
      )}
      <Button
        id="place-order-button"
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
