import TargetsService from './service'

const targetsService = new TargetsService()

export default {
  findById: (id, projection) => targetsService.findById(id, projection),
  create: data => targetsService.create(data),
  findOneAndUpdate: (query, set) => targetsService.findOneAndUpdate(query, set),
  findAll: (query, proj) => targetsService.findAll(query, proj),
  hardDelete: query => targetsService.hardDelete(query)
}
