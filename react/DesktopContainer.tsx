import React from 'react'

import { useResponsiveContext } from './ResponsiveContainer'

const DesktopContainer: React.FC = ({ children }) => {
  const { device } = useResponsiveContext()

  if (device !== 'desktop') {
    return null
  }

  return <>{children}</>
}

export default DesktopContainer
