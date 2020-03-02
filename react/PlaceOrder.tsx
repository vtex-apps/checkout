import React from 'react'
import { Button } from 'vtex.styleguide'

import styles from './PlaceOrder.css'

const PlaceOrder: React.FC = () => {
  return (
    <div className={`ph8 ${styles.buttonWrapper}`}>
      <Button block size="large">
        Place Order
      </Button>
    </div>
  )
}

export default PlaceOrder
