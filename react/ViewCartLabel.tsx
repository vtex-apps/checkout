import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['viewCartLabel'] as const

const ViewCartLabel: React.FC = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <span className={`c-muted-1 t-body f6 fw6 ${handles.viewCartLabel}`}>
      <FormattedMessage id="store/view-cart-label" />
    </span>
  )
}

export default ViewCartLabel
