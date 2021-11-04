import CityContext from '../apps/common/contexts/cities'
import {
  getDataFromCacheByQuery,
  setCacheDataByQuery
} from '../apps/helpers/redis'
const TWENTY_FOUR_HOURS = 86400000

export const getCityFromCache = async cityId => {
  try {
    const cachedCities = await getDataFromCacheByQuery('get:cities')
    if (cachedCities) {
      const city = cachedCities.filter(city => city._id === cityId)
      return city[0]
    } else {
      const cities = await CityContext.findAll()
      await setCacheDataByQuery('get:cities', cities, TWENTY_FOUR_HOURS)
      const city = cities.filter(city => city._id === cityId)
      return city[0]
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const addNewAdminToCache = async admin => {
  const cachedAdmins = await getDataFromCacheByQuery('get:admins')
  await setCacheDataByQuery(
    'get:admins',
    [...cachedAdmins, admin],
    TWENTY_FOUR_HOURS
  )
}

export const addNewVolunteerToCache = async volunteer => {
  const cachedVolunteer = await getDataFromCacheByQuery('get:volunteers')
  await setCacheDataByQuery(
    'get:volunteers',
    [...cachedVolunteer, volunteer],
    TWENTY_FOUR_HOURS
  )
}

export const updateVolunteerCache = async volunteer => {
  const cachedVolunteer = await getDataFromCacheByQuery('get:volunteers')
  const newCachedVolunteers = cachedVolunteer.map(singleVolunteer => {
    if (singleVolunteer._id === volunteer._id.toString()) {
      return { ...singleVolunteer, ...volunteer }
    }
    return singleVolunteer
  })
  await setCacheDataByQuery(
    'get:volunteers',
    newCachedVolunteers,
    TWENTY_FOUR_HOURS
  )
}
export const deleteVolunteerFromCache = async userId => {
  const cachedVolunteer = await getDataFromCacheByQuery('get:volunteers')
  if (!cachedVolunteer) {
    return
  }
  const newCachedVolunteers = cachedVolunteer.filter(
    singleVolunteer => singleVolunteer.userId !== userId
  )
  await setCacheDataByQuery(
    'get:volunteers',
    newCachedVolunteers,
    TWENTY_FOUR_HOURS
  )
}

export const deleteAdminFromCache = async userId => {
  const cachedAdmins = await getDataFromCacheByQuery('get:admins')
  if (!cachedAdmins) {
    return
  }
  const newCashedAdmins = cachedAdmins.filter(
    singleAdmin => singleAdmin._id !== userId
  )
  await setCacheDataByQuery('get:admins', newCashedAdmins, TWENTY_FOUR_HOURS)
}
