import { IFormModel, ISchema, ISchemaItem, errorMapObject } from './common.models'

type obj = Record<string,  string | number>

const isArray = (target: string[]) => Object.prototype.toString.call(target) === '[object Array]'

const isObject = (target: obj) => typeof target === 'object' && target

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computeValue = (obj: Record<string, any>, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) => String.prototype.split.call(path, regexp).filter(Boolean).reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj)
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)

  // Ensure the result is not undefined before returning it
  return result !== undefined ? String(result) : defaultValue
}


interface ValidationResult {
  isValid: boolean
  errorMap: errorMapObject
}

const validatePayload = (schema: ISchema, model: IFormModel, params: unknown = {}): ValidationResult => {
  const errorMap: obj = {}
  let count = 0
  schema.forEach(({ path, custom, pattern, message, emptyCheck }: ISchemaItem) => {
    const value: string | undefined = computeValue(model, path)

    // Check if the value is a string before using it
    if (typeof value === 'string') {
      const isInvalid = custom ? !custom(model, value, params) : (emptyCheck || value) && !pattern.test(value)
      if (!errorMap[path] && isInvalid) {
        count += 1
        errorMap[path] = message
      }
    }
  })

  return {
    isValid: count === 0,
    errorMap,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const bemClass = (input: any[] = []) => {
  const blk = input[0]
  let elt = input[1]
  let mods = input[2]
  let className = input[3]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[] = []

  if (isArray(elt) || isObject(elt)) {
    className = mods
    mods = elt
    elt = ''
  }

  const eltClass = elt ? `${blk}__${elt}` : blk
  result.push(eltClass)

  if (isArray(mods)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mods.forEach((mod: any) => {
      const classStr = elt ? `${blk}__${elt}--${mod}` : `${blk}--${mod}`
      result.push(classStr)
    })
  }

  if (isObject(mods) && !isArray(mods)) {
    const modObjKeys = Object.keys(mods)
    modObjKeys.forEach((key) => {
      if (mods[key]) {
        const classStr = elt ? `${blk}__${elt}--${key}` : `${blk}--${key}`
        result.push(classStr)
      }
    })
  }

  if (className) {
    result.push(className)
  }

  return result.join(' ')
}

export {
  computeValue,
  validatePayload,
  bemClass,
}
