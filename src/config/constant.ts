const REGEX_EMPTY = /\S+/
const REGEX_CONTACT = /^([0-9]{10})+$/
const REGEX_PIN_CODE = /^([0-9]{6})+$/
const REGEX_EMAIL = /^\w+([\\.-]?\w+)@\w+([\\.-]?\w+)(\.\w{2,3})+$/
const REGEX_NUMBER = /^[0-9]+$/
const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export {
  REGEX_EMPTY,
  REGEX_CONTACT,
  REGEX_PIN_CODE,
  REGEX_EMAIL,
  REGEX_NUMBER,
  REGEX_PASSWORD,
}
