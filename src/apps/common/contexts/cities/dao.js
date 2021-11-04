import Dao from '../../../../libraries/dao'
import CityModel from './schema'

export default class CityDao extends Dao {
  constructor() {
    super(CityModel)
  }

  async create(City) {
    const city = new CityModel(City)
    return city.save()
  }
}
