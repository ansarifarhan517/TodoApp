import React, { useCallback, useState } from 'react'
import { validatePayload } from '@utils'
import { IFormModel, ISchema, errorMapObject } from '@utils/common.models'

export type IHocFormPropsOptions = {
  schema: ISchema
  formModel: IFormModel
}

const HocForm = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WrappedComponent: React.FC<any>,
  options: IHocFormPropsOptions,
) => {
  const Form: React.FC = () => {
    const [errorMap, setErrorMap] = useState<errorMapObject>({})
    const [formData, setFormData] = useState<IFormModel>(options.formModel)

    const onChangeHandler = useCallback(
      (valueObj: Record<string, string>) => {
        const newFormData = {
          ...formData,
          ...valueObj,
        }
        setFormData(newFormData)
      },
      [formData],
    )

    const onSubmitHandler = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault()
        const valid = validatePayload(options.schema, formData)
        setErrorMap(valid.errorMap)
      },
      [formData, options.schema],
    )

    return (
      <WrappedComponent
        errorMap={errorMap}
        onChangeHandler={onChangeHandler}
        onSubmitHandler={onSubmitHandler}
        formData={formData}
        setFormData={setFormData}
      />
    )
  }

  return { default: Form }
}

export default HocForm
