import StepsService from './service'

const stepsService = new StepsService()

export default {
  findOneBy: (query, projection, populate, options) =>
    stepsService.findOneBy(query, projection, populate, options),
  findBy: (query, set) => stepsService.findBy(query, set),
  create: stepsData => stepsService.create(stepsData),
  findOneAndUpdate: (query, set) => stepsService.findOneAndUpdate(query, set),
  hardDelete: query => stepsService.hardDelete(query),
  findAll: () => stepsService.findAll()
}
