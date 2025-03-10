import React, { memo, useCallback } from 'react'
import { bemClass } from '@utils'
import './style.scss'

const blk = 'radio-button'

type IRadioButtonProps = {
  id: string
  name: string
  checked: boolean
  label: string
  value: string | number
  disabled: boolean
  onChangeHandler: (arg0: onChangeHandlerParameter) => void
  className?: string
}

type onChangeHandlerParameter = Record<string, string>

const Radio: React.FC<IRadioButtonProps> = ({
  id,
  name,
  checked,
  label,
  value,
  disabled,
  onChangeHandler,
  className,
}) => {
  const onClickHandler: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (e: React.MouseEvent) => {
      const isChecked = (e.target as HTMLInputElement).value
      onChangeHandler({ [name]: isChecked })
    },
    [name],
  )

  return (
    <div className={bemClass([blk, { active: checked }, className])}>
      <label className={bemClass([blk, 'label'])}>{label}</label>
      <input
        type="radio"
        className={bemClass([blk, 'input'])}
        id={id}
        name={name}
        value={value}
        defaultChecked={checked}
        disabled={disabled}
        onClick={onClickHandler}
      />
    </div>
  )
}

export default memo(Radio)
