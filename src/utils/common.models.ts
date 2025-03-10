//= ==========>Create Form Model
export interface ICreate {
  formData?: IFormModel
  errorMap?: errorMapObject
  onChangeHandler: (valueObj: object) => void
  onSubmitHandler: (e: React.FormEvent) => void
  setFormData?: React.Dispatch<React.SetStateAction<object>>

}

//= ==========>Validation Schema Model

export type validationFunctionResult = {
  path: string
  pattern: RegExp
  message: string
  emptyCheck: boolean
}

export type IFormModel = Record<string, unknown>;

export type errorMapObject = Record<string, unknown>

export interface ISchemaItem {
  emptyCheck: boolean
  message: string
  path: string
  pattern: RegExp
  custom?: (model: IFormModel, value: string | undefined, params: unknown) => boolean
}

export interface ISchema extends Array<ISchemaItem> {}

//= =============> DropDownOptions
export interface IMultiDropdownOptions {
  label: string
  value: string | number
}
