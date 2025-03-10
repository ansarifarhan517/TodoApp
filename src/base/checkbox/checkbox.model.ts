export type ICheckboxProps = {
  label?: string
  id?: string | undefined
  name: string
  checked: boolean
  disabled?: boolean
  className?: string
  onChangeHandler: (arg0: onChangeHandlerParameter) => void
}

type onChangeHandlerParameter = Record<string, boolean>
