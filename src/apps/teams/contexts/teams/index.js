import TeamsService from './service'

const teamsService = new TeamsService()

export default {
  show: id => teamsService.show(id),
  findById: (id, projection) => teamsService.findById(id, projection),
  create: data => teamsService.create(data),
  findOneAndUpdate: (query, set) => teamsService.findOneAndUpdate(query, set),
  findAll: (query, proj) => teamsService.findAll(query, proj),
  hardDelete: query => teamsService.hardDelete(query)
}
