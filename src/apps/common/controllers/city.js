import CityContext from '../contexts/cities'
import { logError } from '../contexts/log'
import {
  setCacheDataByQuery,
  getDataFromCacheByQuery
} from '../../helpers/redis'
import { cacheCities } from '../../../helpers/cache'
const ThirtyDays = 3600000
export const getCities = async (req, res) => {
  try {
    const cachedVersion = await getDataFromCacheByQuery('get:cities')
    if (cachedVersion) {
      const parsedCacheVersion = cachedVersion
      res.cached = true
      res.status(200).send({
        cities: parsedCacheVersion
      })
    } else {
      const cities = await CityContext.findAll()
      await setCacheDataByQuery('get:cities', cities, ThirtyDays)
      res.status(200).send({ cities, cached: false })
    }
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get cities')
  }
}

export const createCity = async (req, res) => {
  try {
    const cityData = req.body
    const city = await CityContext.create(cityData)
    cacheCities()
    return res.status(200).send({
      city
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create city')
  }
}
export const editCity = async (req, res) => {
  const { city, _id } = req.body
  try {
    const editedCity = await CityContext.findOneAndUpdate({ _id }, city)
    cacheCities()
    return res.status(200).send({
      editedCity
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not edit city')
  }
}
