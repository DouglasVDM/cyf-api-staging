import { GENDER_ENUM } from '../../src/apps/constants'
import {
  arrayOfStringToInCondition,
  arrayOfNumberToInCondition,
  objectToStringKey,
  isValidDate,
  validateArrayWithEnum,
  validateInputs
} from '../../src/apps/statistics'

afterAll(async () => {
  await global.tearDown()
})

describe('Statistics useCases utils', () => {
  test('arrayOfStringToInCondition, It should return array of objects', async () => {
    const arrayOfStrings = ['test1', 'test2']
    const orCondition = arrayOfStringToInCondition(arrayOfStrings, 'key')

    expect(orCondition).toEqual({ key: { $in: arrayOfStrings } })
  })

  test('arrayOfNumberToInCondition, It should return array of objects', async () => {
    const arrayOfNumbers = [1, 2]
    const orCondition = arrayOfNumberToInCondition(arrayOfNumbers, 'key')

    expect(orCondition).toEqual({ key: { $in: arrayOfNumbers } })
  })

  test('objectToStringKey, It should return an string key', async () => {
    const key = [{ key: 1 }, { key: 1 }]
    expect(objectToStringKey(key)).toEqual('[{"key":1},{"key":1}]')
  })

  describe('isValidDate tests', () => {
    test('It should return true if valid date passed in', async () => {
      expect(isValidDate('2020-8-11')).toEqual(true)
    })

    test('It should return false if invalid date passed in', async () => {
      expect(isValidDate('Invalid date')).toEqual(false)
    })
  })

  describe('validateArrayWithEnum tests', () => {
    test('It should return true if valid data passed in', async () => {
      expect(validateArrayWithEnum(['Male'], GENDER_ENUM)).toEqual(true)
    })

    test('It should return false if invalid data passed in', async () => {
      expect(validateArrayWithEnum(['Invalid data'], GENDER_ENUM)).toEqual(
        false
      )
    })
  })

  describe('validateInputs tests', () => {
    test('It should return error message if Invalid date passed in', async () => {
      const inputs = {
        stepUpdatedFromDate: ['Invalid data']
      }
      expect(validateInputs(inputs)).toEqual('Requested date is not valid')
    })

    test('It should return error message if Invalid gender passed in', async () => {
      const inputs = {
        genders: ['Invalid data']
      }
      expect(validateInputs(inputs)).toEqual('Requested gender is not valid')
    })

    test('It should return error message if Invalid step status passed in', async () => {
      const inputs = {
        stepStatus: ['Invalid data']
      }
      expect(validateInputs(inputs)).toEqual('Requested status is not valid')
    })
    test('It should be undefined if valid data passed in', async () => {
      const inputs = {
        stepUpdatedFromDate: ['2020-8-11'],
        genders: ['Male'],
        stepStatus: ['Approved']
      }
      expect(validateInputs(inputs)).toEqual(undefined)
    })
  })
})
