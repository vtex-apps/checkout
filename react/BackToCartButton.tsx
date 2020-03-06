import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { ButtonPlain } from 'vtex.styleguide'

const BackToCartButton: React.FC = () => {
  const { navigate } = useRuntime()

  const handleClick = () => {
    navigate({ page: 'store.checkout.cart' })
  }

  return (
    <ButtonPlain onClick={handleClick}>
      <FormattedMessage id="store/edit-cart-label" />
    </ButtonPlain>
  )
}

export default BackToCartButton
