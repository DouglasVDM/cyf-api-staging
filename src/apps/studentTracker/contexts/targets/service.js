import CommunicationTargetsDao from './dao'

export default class CommunicationTargetsService {
  constructor() {
    this.communicationTargetsDao = new CommunicationTargetsDao()
  }

  async findById(id, projection) {
    const communicationTarget = await this.communicationTargetsDao.findById(
      id,
      projection
    )
    return communicationTarget
  }

  async create(data) {
    return this.communicationTargetsDao.create(data)
  }

  async findOneAndUpdate(query, set) {
    return this.communicationTargetsDao.findOneAndUpdate(query, set)
  }

  async findAll(query, proj) {
    return this.communicationTargetsDao.findAll(query, proj)
  }

  async hardDelete(query) {
    return this.communicationTargetsDao.hardDelete(query)
  }
}
