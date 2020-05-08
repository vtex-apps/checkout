import React from 'react'

import { useResponsiveContext } from './ResponsiveContainer'

const MobileContainer: React.FC = ({ children }) => {
  const { isMobile } = useResponsiveContext()

  if (!isMobile) {
    return null
  }

  return <>{children}</>
}

export default MobileContainer
