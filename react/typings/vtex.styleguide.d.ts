import React from 'react'

declare module 'vtex.styleguide' {
  export const Button: React.FC<{
    block?: boolean
    size?: 'large' | 'regular' | 'small'
    isLoading?: boolean
  } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>>
}
