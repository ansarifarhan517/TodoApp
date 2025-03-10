import React from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'panel'

type IPanelProps = {
  title?: string
  children: React.ReactNode
  className?: string
}

const Panel: React.FC<IPanelProps> = ({ title, children, className }) => {
  const eltClass = bemClass([blk, {}, className])
  return (
    <div className={eltClass}>
      {title && (<div className={bemClass([blk, 'title'])}>{title}</div>)}
      {children}
    </div>
  )
}

export default Panel
