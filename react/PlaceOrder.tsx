import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

import styles from './PlaceOrder.css'

const PlaceOrder: React.FC = () => {
  return (
    <div className={`ph8 ${styles.buttonWrapper}`}>
      <Button block size="large">
        <FormattedMessage id="store/place-order-button" />
      </Button>
    </div>
  )
}

export default PlaceOrder
