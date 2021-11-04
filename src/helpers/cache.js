import CityContext from '../apps/common/contexts/cities'
import {
  findApplicants,
  getStudentsData,
  cacheAdmins
} from '../apps/application_process/helpers/utils'
import { cachedVolunteers } from '../apps/volunteer/useCases/utils'
import { setCacheDataByQuery } from '../apps/helpers/redis/index'
import { logSimple } from '../apps/common/contexts/log'
import { performance } from 'perf_hooks'

const TWENTY_FOUR_HOURS = 86400000

async function setApplicantsCacheByCityId(cyfCityId) {
  const applicants = await findApplicants(cyfCityId)
  const applicantData = await Promise.all(
    applicants.map(applicant => getStudentsData(applicant))
  )
  await setCacheDataByQuery(cyfCityId, applicantData, TWENTY_FOUR_HOURS)
}
export const cacheCities = async () => {
  const cities = await CityContext.findAll()
  await setCacheDataByQuery('get:cities', cities, TWENTY_FOUR_HOURS)
}
export const setCitiesCache = async () => {
  const t0 = performance.now()
  const cities = await CityContext.findAll()
  await Promise.all(cities.map(city => setApplicantsCacheByCityId(city._id)))
  await cachedVolunteers()
  await cacheAdmins()
  const t1 = performance.now()
  const cacheTime = (t1 - t0) / 1000
  logSimple(`Cities caching took (${cacheTime.toFixed(2)}) seconds.`)
}
