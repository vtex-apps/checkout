import classNames from 'classnames'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['viewCartLabel'] as const

interface Props {
  variant?: 'primary' | 'normal'
}

const ViewCartLabel: React.FC<Props> = ({ variant = 'normal' }) => {
  const handles = useCssHandles(CSS_HANDLES)

  const classes = classNames(handles.viewCartLabel, 't-body f6 fw6', {
    'c-muted-1': variant === 'normal',
    'c-action-primary': variant === 'primary',
  })

  return (
    <span className={classes}>
      <FormattedMessage id="store/view-cart-label" />
    </span>
  )
}

export default ViewCartLabel
