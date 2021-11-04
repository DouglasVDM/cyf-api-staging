import dayjs from 'dayjs'
import { GENDER_ENUM, STEP_STATUS_ENUM } from '../../constants'

export const arrayOfStringToInCondition = (array = [], key) => {
  if (array.length > 0) {
    return { [key]: { $in: array } }
  }
  return {}
}

export const arrayOfNumberToInCondition = (array = [], key) => {
  if (array.length > 0) {
    return { [key]: { $in: array.map(item => parseFloat(item)) } }
  }
  return {}
}

export const objectToStringKey = obj => {
  return JSON.stringify(obj)
}

export const isValidDate = date => {
  try {
    if (new Date(date)) {
      return dayjs(date).isValid()
    }
  } catch (error) {
    return false
  }
}

export const validateArrayWithEnum = (array, enumList) => {
  return !array.map(item => enumList.includes(item)).includes(false)
}

export const validateInputs = inputs => {
  if (inputs) {
    if (inputs.genders && !validateArrayWithEnum(inputs.genders, GENDER_ENUM)) {
      return 'Requested gender is not valid'
    }
    if (
      inputs.stepUpdatedFromDate &&
      !isValidDate(inputs.stepUpdatedFromDate[0])
    ) {
      return 'Requested date is not valid'
    }
    if (
      inputs.stepStatus &&
      !validateArrayWithEnum(inputs.stepStatus, STEP_STATUS_ENUM)
    ) {
      return 'Requested status is not valid'
    }
  }
}
