import React from 'react'
import { Router } from 'vtex.checkout-container'

const REVIEW_ROUTE = '/'

const ReviewContainer: React.FC = ({ children }) => {
  const matches = !!Router.useRouteMatch(REVIEW_ROUTE)

  if (!matches) {
    return null
  }

  return <>{children}</>
}

export default ReviewContainer
