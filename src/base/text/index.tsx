import React, { ElementType, memo } from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'text'

type ITextProps = {
  tag: ElementType
  children: React.ReactNode
  typography?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
  fontWeight?: 'thin' | 'normal' | 'semi-bold' | 'bold'
  color?: 'black' | 'gray-darker' | 'gray-dark' | 'gray' | 'gray-light' | 'white' | 'primary' | 'secondary'
  className?: string
  align?: 'left' | 'center' | 'right'
  transform?: string
  clickHandler?: () => void
  changeHandler?: () => void
}

const Text: React.FC<ITextProps> = ({
  tag: Tag,
  children,
  typography,
  fontWeight,
  color,
  align,
  className,
  transform,
  clickHandler,
  changeHandler,

}) => {
  const eltClass = bemClass([blk, {
    [align ?? '']: !!align,
    [color ?? '']: !!color,
    [fontWeight ?? '']: !!fontWeight,
    [typography ?? '']: !!typography,
    [transform ?? '']: !!transform,
  }, className])

  return (
    <Tag
      className={eltClass}
      onClick={clickHandler}
      onChange={changeHandler}
    >
      {children}
    </Tag>
  )
}

// Text.defaultProps = {
//   typography: 'm',
//   fontWeight: 'normal',
//   color: 'primary',
//   align: 'center',
//   className: '',
//   transform: '',
//   clickHandler: () => {},
//   changeHandler: () => {},
// }

export default memo(Text)
