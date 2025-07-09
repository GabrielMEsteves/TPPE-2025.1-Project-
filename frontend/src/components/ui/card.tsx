import React from 'react'

interface CardProps {
  className?: string
  children: React.ReactNode
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ 
  className = '', 
  children, 
  ...props 
}) => {
  return (
    <div 
      className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardContentProps {
  className?: string
  children: React.ReactNode
}

export const CardContent: React.FC<CardContentProps> = ({ 
  className = '', 
  children 
}) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  )
}