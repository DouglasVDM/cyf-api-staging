import { countStudentsMatchingCondition } from '../useCases'

export const getClassStatus = async (query = {}) => {
  const {
    stepNumbers,
    cyfCityIds,
    genders,
    stepStatus,
    stepUpdatedFromDate
  } = query
  const studentsMatchingCondition = await countStudentsMatchingCondition(
    stepNumbers,
    cyfCityIds,
    genders,
    stepStatus,
    stepUpdatedFromDate
  )
  return {
    studentsMatchingCondition
  }
}
