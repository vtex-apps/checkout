import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

const messages = defineMessages({
  productCount: {
    id: 'store/checkout-product-count',
  },
})

const ProductCounter: React.FC = () => {
  const {
    orderForm: { items },
  } = useOrderForm()

  const productCount = items.length

  return (
    <p className="c-muted-1 t-body b ma0">
      <FormattedMessage
        {...messages.productCount}
        values={{ quantity: productCount }}
      />
    </p>
  )
}

export default ProductCounter
