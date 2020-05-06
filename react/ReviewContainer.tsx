import React from 'react'
import { Router } from 'vtex.checkout-container'

const REVIEW_ROUTE = '/'

const ReviewContainer: React.FC = ({ children }) => {
  const match = Router.useRouteMatch(REVIEW_ROUTE)

  if (!match?.isExact) {
    return null
  }

  return <>{children}</>
}

export default ReviewContainer
