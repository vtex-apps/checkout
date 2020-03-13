import React from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

const messages = defineMessages({
  productCount: {
    id: 'store/checkout-product-count',
  },
})

interface Props {
  type?: 'simple' | 'full'
}

const ProductCounter: React.FC<Props> = ({ type = 'full' }) => {
  const {
    orderForm: { items },
  } = useOrderForm()

  const productCount = items.length

  return (
    <p className="c-muted-1 t-body b ma0">
      {type === 'full' ? (
        <FormattedMessage
          {...messages.productCount}
          values={{ quantity: productCount }}
        />
      ) : (
        productCount
      )}
    </p>
  )
}

export default ProductCounter
