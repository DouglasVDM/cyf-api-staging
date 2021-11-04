import { countApplicantsQuery } from './queryPlans'
import { getCityIdByCityName, getStepIdByStepNumber } from '../services'
import StudentContext from '../../application_process/contexts/students'

export async function getApplicantCountLondon() {
  const step1 = await getStepIdByStepNumber(1)
  const step2 = await getStepIdByStepNumber(2)
  const london = await getCityIdByCityName('London')

  try {
    const result = await StudentContext.aggregate(
      countApplicantsQuery([step1, step2], [london])
    )
    if (result.length === 0) {
      return 0
    }
    return result[0].count
  } catch (error) {
    throw new Error(error)
  }
}

export async function getApplicantCountManchester() {
  try {
    const step1 = await getStepIdByStepNumber(1)
    const step2 = await getStepIdByStepNumber(2)
    const manchester = await getCityIdByCityName('Manchester')
    const result = await StudentContext.aggregate(
      countApplicantsQuery([step1, step2], [manchester])
    )
    if (result.length === 0) {
      return 0
    }
    return result[0].count
  } catch (error) {
    throw new Error(error)
  }
}
