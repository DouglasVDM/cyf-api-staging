import ClassesService from './service'

const classesService = new ClassesService()

export default {
  show: stepId => classesService.show(stepId),
  findBy: (query, set) => classesService.findBy(query, set),
  create: set => classesService.create(set),
  findOneAndUpdate: (query, set) => classesService.findOneAndUpdate(query, set),
  hardDelete: query => classesService.hardDelete(query),
  findAll: () => classesService.findAll()
}
