import {  emailField , emptyField, passwordField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emptyField('userName'),
  emailField('email'),
  passwordField('password'),
]

export { schema }
