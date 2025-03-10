import React, { memo } from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'icon'

type IIConProps = {
  name: string
  className?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
  iconScale?: string
}

const Icon: React.FC<IIConProps> = ({
  name,
  className,
  color = '',
  size = 'small',
  iconScale,
}) => {
  const eltClass = bemClass([
    blk,
    {
      [color]: !!color,
      [size]: !!size,
    },
    className,
  ])

  const iconClass = `fa fa-${name} fa-${iconScale}`

  return (
    <span className={eltClass}>
      <i className={iconClass} />
    </span>
  )
}

export default memo(Icon)
