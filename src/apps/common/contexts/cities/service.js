import CityDao from './dao'
import formatName from '../../../application_process/helpers/formatNames'

export default class CityService {
  constructor() {
    this.cityDao = new CityDao()
  }

  async findBy(query) {
    const city = await this.cityDao.findOneBy(query)
    return city
  }

  async findOneBy(query) {
    const city = await this.cityDao.findOneBy(query)
    return city
  }

  async hardDelete(query) {
    const cities = await this.cityDao.hardDelete(query)
    return cities
  }

  async findAll() {
    const cities = await this.cityDao.findAll()
    return cities
  }

  async findOneAndUpdate(query, set) {
    return this.cityDao.findOneAndUpdate(query, set)
  }

  async create(cityData) {
    const name = formatName(cityData.name)
    const city = await this.cityDao.findOneBy({ name })
    if (city) {
      throw new Error('City already exists')
    }
    return this.cityDao.create({
      ...cityData,
      name
    })
  }
}
