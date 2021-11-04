import {
  setCacheDataByQuery,
  getDataFromCacheByQuery
} from '../../helpers/redis'
import { showApplicantByUserId, getStudentsData } from './utils'
const TWENTY_FOUR_HOURS = 86400000

export const updateApplicantCache = async applicant => {
  const cachedApplicantsByCity = await getDataFromCacheByQuery(applicant.cityId)
  if (!cachedApplicantsByCity) {
    return
  }
  const updatedCache = cachedApplicantsByCity.map(singleApplicant => {
    if (singleApplicant.userId === applicant.userId) {
      return {
        ...singleApplicant,
        ...applicant
      }
    }
    return singleApplicant
  })
  await setCacheDataByQuery(applicant.cityId, updatedCache, TWENTY_FOUR_HOURS)
}

const updateStep = (steps, step) => {
  let newSteps
  newSteps = steps.filter(singleStep => singleStep.stepId !== step.stepId)
  return [...newSteps, step]
}

export const updateApplicantStepCache = async step => {
  const applicant = await showApplicantByUserId(step.userId)
  const cachedApplicantsByCity = await getDataFromCacheByQuery(applicant.cityId)
  const updatedCache = cachedApplicantsByCity.map(singleApplicant => {
    if (singleApplicant.userId === step.userId) {
      return {
        ...singleApplicant,
        steps: updateStep(singleApplicant.steps, step)
      }
    } else {
      return singleApplicant
    }
  })
  await setCacheDataByQuery(applicant.cityId, updatedCache, TWENTY_FOUR_HOURS)
}

export const changeApplicantCityInCache = async (applicant, cityId) => {
  const cachedApplicantsByCity = await getDataFromCacheByQuery(cityId)
  const updatedCache = cachedApplicantsByCity.filter(
    singleApplicant => singleApplicant.userId !== applicant.userId
  )
  await setCacheDataByQuery(cityId, updatedCache, TWENTY_FOUR_HOURS)
  const cachedApplicantsBySecondCity = await getDataFromCacheByQuery(
    applicant.cityId
  )
  if (cachedApplicantsBySecondCity) {
    const newApplicant = await getStudentsData(applicant)
    setCacheDataByQuery(
      applicant.cityId,
      [...cachedApplicantsBySecondCity, newApplicant],
      TWENTY_FOUR_HOURS
    )
  }
  return updatedCache
}

export const updateUserCache = async user => {
  const cachedUsers = await getDataFromCacheByQuery('get:admins')
  if (!cachedUsers) {
    return
  }
  const newCachedUsers = cachedUsers.map(singleUser => {
    if (singleUser._id === user._id.toString()) {
      return { ...singleUser, ...user }
    }
    return singleUser
  })

  await setCacheDataByQuery('get:admins', newCachedUsers, TWENTY_FOUR_HOURS)
}

export const removeApplicantFromCache = async (userId, cityId) => {
  const cachedApplicants = await getDataFromCacheByQuery(cityId)
  if (!cachedApplicants) {
    return
  }
  const newCachedApplicants = cachedApplicants.filter(
    applicant => applicant.userId !== userId
  )
  await setCacheDataByQuery(cityId, newCachedApplicants, TWENTY_FOUR_HOURS)
}

export const addNewApplicantToCache = async applicant => {
  const cachedApplicants = await getDataFromCacheByQuery(applicant.cityId)
  await setCacheDataByQuery(
    applicant.cityId,
    [...cachedApplicants, applicant],
    TWENTY_FOUR_HOURS
  )
}
