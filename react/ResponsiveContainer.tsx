import React, { useContext } from 'react'
import { useDevice } from 'vtex.device-detector'
import { DeviceInfo } from 'vtex.device-detector/react/useDevice'

const ctx = React.createContext<DeviceInfo | undefined>(undefined)

export const useResponsiveContext = () => {
  const contextValue = useContext(ctx)

  if (contextValue === undefined) {
    throw new Error(
      'useResponsiveContext must be used inside ResponsiveContainer'
    )
  }

  return contextValue
}

const ResponsiveContainer: React.FC = ({ children }) => {
  const deviceInfo = useDevice()

  return <ctx.Provider value={deviceInfo}>{children}</ctx.Provider>
}

export default ResponsiveContainer
