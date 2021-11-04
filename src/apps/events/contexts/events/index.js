import EventsService from './service'

const eventsService = new EventsService()

export default {
  show: id => eventsService.show(id),
  findById: (id, projection) => eventsService.findById(id, projection),
  create: data => eventsService.create(data),
  findOneAndUpdate: (query, set) => eventsService.findOneAndUpdate(query, set),
  findAll: (query, proj) => eventsService.findAll(query, proj),
  hardDelete: query => eventsService.hardDelete(query)
}
