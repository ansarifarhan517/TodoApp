import React, { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'button'

type IButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'reset' | 'submit'
  category?: string
  id?: string | number | undefined
  className?: string
  disabled?: boolean
  asLink?: boolean
  href?: string
  isBlock?: boolean
  withIcon?: boolean
  loading?: boolean
  clickHandler?: (e: React.MouseEvent) => void
}

const Button: React.FC<IButtonProps> = ({
  children,
  type = 'button',
  category = 'primary',
  id,
  className,
  disabled,
  asLink,
  href = '/',
  isBlock,
  withIcon,
  loading,
  clickHandler,
}) => {
  const eltClassName = bemClass([blk, {
    [category || '']: category,
    loading,
    block: isBlock,
    'with-icon': withIcon,
    [`${category}-loading`]: loading,
    disabled,
  }, className])

  const buttonId = id ? id.toString() : undefined

  if (asLink) {
    return (
      <NavLink
        to={href}
        className={eltClassName}>
        {children}
      </NavLink>
    )
  }

  return (
    <button
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={eltClassName}
      disabled={disabled}
      onClick={clickHandler}
      id={buttonId}
    >
      {children}
    </button>
  )
}

export default memo(Button)
