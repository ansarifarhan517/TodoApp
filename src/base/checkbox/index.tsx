import React, { useCallback } from 'react'
import { bemClass } from '@utils'
import { ICheckboxProps } from './checkbox.model'
import './style.scss'

const blk = 'checkbox'

const Checkbox: React.FC<ICheckboxProps> = ({
  label,
  id,
  name,
  checked,
  disabled,
  onChangeHandler,
  className,
}) => {
  const onClickHandler: React.MouseEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const isChecked = (event.target as HTMLInputElement).checked
      onChangeHandler({ [name]: isChecked })
    },
    [name, onChangeHandler]
  )

  // Always render the label element.
  // If no label is provided, render a non-breaking space.
  const labelClass = bemClass([blk, 'label', { 'no-label': !label }])
  const eltClass = bemClass([blk, { active: checked }, className])

  return (
    <div className={eltClass}>
      <label className={labelClass}>
        {label || '\u00A0'}
      </label>
      <input
        type="checkbox"
        name={name}
        id={id}
        className={bemClass([blk, 'input'])}
        checked={checked}
        disabled={disabled}
        onClick={onClickHandler}
      />
    </div>
  )
}

export default Checkbox
