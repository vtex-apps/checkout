import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderCoupon } from 'vtex.order-coupon/OrderCoupon'

interface Props {
  lean?: boolean
}

const SummaryWrapper: React.FC<Props> = ({ lean = false }) => {
  const {
    orderForm: {
      totalizers,
      value,
      marketingData: { coupon },
    },
  } = useOrderForm()

  const { insertCoupon } = useOrderCoupon()

  return (
    <div className={lean ? '' : 'mh8-m mh0-l pt6 pt0-l bt b--muted-4 bn-l'}>
      <ExtensionPoint
        id="checkout-summary"
        blockProps={{
          totalizers,
          total: value,
          coupon,
          insertCoupon,
        }}
      />
    </div>
  )
}

export default SummaryWrapper
