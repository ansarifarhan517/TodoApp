import React, { PureComponent } from 'react'
import { bemClass } from '@utils'

import './style.scss'

const blk = 'dropdown-input'
type ChangeHandlerProps = Record<string, string>

type DropDownProps = {
  label?: string
  value?: string | number
  disabled?: boolean
  invalid?: boolean
  valueMap?: string | number
  labelMap?: string
  name: string
  className?: string
  controlClassName?: string
  isRequired?: boolean
  options: Array<{
    label?: string
    labelMap?: string
    value?: string | number
    valueMap?: string | number
  }>
  category?: string
  changeHandler: (arg0: ChangeHandlerProps) => void
}

class DropDown extends PureComponent<DropDownProps> {
  changeHandler: React.ChangeEventHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value
    const {
      changeHandler,
      name,
    } = this.props
    changeHandler({ [name]: value })
  }

  render () {
    const {
      label,
      value = 'Select',
      disabled,
      invalid,
      className,
      labelMap = '',
      valueMap = '',
      controlClassName,
      isRequired,
      options,
      category = 'single',

    } = this.props

    const eltClass = bemClass([blk, { [category]: category }, className])
    const dropDownFieldClass = bemClass([
      blk,
      'control',
      { invalid },
      controlClassName,
    ])

    return (
      <div className={eltClass}>
        <label className={bemClass([blk, 'label'])}>
          {label}
          {isRequired && <span className={bemClass([blk, 'star'])}>*</span>}
        </label>
        <select
          className={dropDownFieldClass}
          disabled={disabled}
          onChange={this.changeHandler}
          value={value}

        >
          {value == 'Select' && <option value="">{value}</option>}
          {options.map((option) => {
            const optionKeyValue = valueMap ? option[valueMap as keyof typeof option] : option.value
            const optionLabelValue = labelMap ? option[labelMap as keyof typeof option] : option.label
            return (
              <option
                key={optionKeyValue}
                value={optionKeyValue}
                selected={value !== 'Select' && optionKeyValue == value}
              >
                {optionLabelValue}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
}

export default DropDown
