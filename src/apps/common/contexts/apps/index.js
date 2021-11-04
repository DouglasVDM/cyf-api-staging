import AppsService from './service'

const appsService = new AppsService()

export default {
  show: stepId => appsService.show(stepId),
  findBy: (query, set) => appsService.findBy(query, set),
  create: set => appsService.create(set),
  findOneAndUpdate: (query, set) => appsService.findOneAndUpdate(query, set),
  hardDelete: query => appsService.hardDelete(query),
  findAll: () => appsService.findAll()
}
