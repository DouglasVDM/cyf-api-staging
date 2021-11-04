import StudentContext from '../../application_process/contexts/students'
import { countStudentsMatchingConditionPipeline } from './queryPlans'
import {
  getDataFromCacheByQuery,
  setCacheDataByQuery
} from '../../helpers/redis'
import { objectToStringKey } from './utils'
import { TWENTY_FOUR_HOURS } from '../../constants'

export const countStudentsMatchingCondition = async (
  stepNumbers,
  cyfCityIds,
  genders,
  stepStatus,
  stepUpdatedFromDate,
  archived
) => {
  const query = {
    stepNumbers,
    cyfCityIds,
    genders,
    stepStatus,
    stepUpdatedFromDate,
    archived
  }
  const cacheKey = objectToStringKey(query)

  const cachedCount = await getDataFromCacheByQuery(cacheKey)
  if (cachedCount) {
    return cachedCount
  }

  const pipeline = countStudentsMatchingConditionPipeline(query)
  const aggregation = await StudentContext.aggregate(pipeline)
  if (aggregation.length === 0) {
    return 0
  }
  const count = aggregation[0].count
  await setCacheDataByQuery(cacheKey, count, TWENTY_FOUR_HOURS)
  return count
}
