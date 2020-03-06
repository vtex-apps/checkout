import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'

const ProductListWrapper: React.FC = () => {
  const {
    orderForm: { items },
  } = useOrderForm()

  return (
    <div className="mt3 mb6">
      <ExtensionPoint id="product-list" blockProps={{ items }} />
    </div>
  )
}

export default ProductListWrapper
