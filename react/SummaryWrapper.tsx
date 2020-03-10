import React from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useOrderCoupon } from 'vtex.order-coupon/OrderCoupon'

const SummaryWrapper: React.FC = () => {
  const {
    orderForm: {
      totalizers,
      value,
      marketingData: { coupon },
    },
  } = useOrderForm()

  const { insertCoupon } = useOrderCoupon()

  return (
    <div className="mh8-m mh0-l pt6 pt0-l bt b--muted-4 bn-l">
      <ExtensionPoint
        id="checkout-summary"
        // @ts-ignore: 2322
        totalizers={totalizers}
        total={value}
        coupon={coupon}
        insertCoupon={insertCoupon}
      />
    </div>
  )
}

export default SummaryWrapper
