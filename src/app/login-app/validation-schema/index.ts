import {  emailField , passwordField } from '@config/validation'
import { validationFunctionResult } from '@utils/common.models'

const schema: validationFunctionResult[] = [
  emailField('email'),
  passwordField('password'),
]

export { schema }
