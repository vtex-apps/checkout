import React, { ReactNode } from 'react'

declare module 'vtex.styleguide' {
  export const Button: React.FC<{
    block?: boolean
    size?: 'large' | 'regular' | 'small'
    isLoading?: boolean
  } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>>

  export const Alert: React.FC<{
    type: 'error' | 'success' | 'warning'
    closeIconLabel?: string
    onClose?: () => void
    focusOnEnter?: boolean
    action?: { onClick: () => void; label: ReactNode }
  }>
}
