import React, { memo } from 'react'
import { Radio } from '@base'

type IRadioButtonGroupProps = {
  id: string
  name: string
  options: Array<{
    label: string
    value: number | string
  }>
  disabled: boolean
  onChangeHandler: (arg0: onChangeHandlerParameter) => void
  selected: string
  className?: string
}

type onChangeHandlerParameter = Record<string, string>

const RadioGroup: React.FC<IRadioButtonGroupProps> = ({
  id,
  name,
  options,
  disabled,
  onChangeHandler,
  selected,
  className,
}) => (
  <>
    {options.map(({ label, value }, index) => {
      const key = `${id}_data_row_${index}`
      return (
        <Radio
          key={key}
          className={className}
          id={id}
          name={name}
          label={label}
          value={value}
          checked={selected === value}
          disabled={disabled}
          onChangeHandler={onChangeHandler}
        />
      )
    })}
  </>

)

RadioGroup.defaultProps = {
  className: '',
  id: '',
  name: '',
  disabled: false,
}

export default memo(RadioGroup)
