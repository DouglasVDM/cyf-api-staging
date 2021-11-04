import CityService from './service'

const cityService = new CityService()

export default {
  findBy: query => cityService.findBy(query),
  findOneBy: query => cityService.findOneBy(query),
  findAll: () => cityService.findAll(),
  show: id => cityService.show(id),
  create: cityData => cityService.create(cityData),
  findOneAndUpdate: (query, set) => cityService.findOneAndUpdate(query, set)
}
