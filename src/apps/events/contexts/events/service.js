import EventsDao from './dao'

export default class EventsService {
  constructor() {
    this.eventsDao = new EventsDao()
  }

  async show(id) {
    const event = await this.eventsDao.findOneBy(id)
    return event
  }

  async findById(id, projection) {
    const events = await this.eventsDao.findById(id, projection)
    return events
  }

  async create(data) {
    return this.eventsDao.create(data)
  }

  async findOneAndUpdate(query, set) {
    return this.eventsDao.findOneAndUpdate(query, set)
  }

  async findAll(query, proj) {
    return this.eventsDao.findAll(query, proj)
  }

  async hardDelete(query) {
    return this.eventsDao.hardDelete(query)
  }
}
