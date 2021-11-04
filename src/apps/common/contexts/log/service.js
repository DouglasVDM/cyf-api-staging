// eslint-disable-next-line
import LogsDao from './dao'

export default class LogsService {
  constructor() {
    this.logsDao = new LogsDao()
  }

  async show(id) {
    const logs = await this.logsDao.findOneBy(id)
    return logs
  }

  async findBy(query, set) {
    const logs = await this.logsDao.findBy(query, set)
    return logs
  }

  async create(set) {
    return this.logsDao.create(set)
  }

  async findOneAndUpdate(query, set) {
    return this.logsDao.findOneAndUpdate(query, set)
  }

  async hardDelete(query) {
    const logs = await this.logsDao.hardDelete(query)
    return logs
  }

  async findAll() {
    const logs = await this.logsDao.findAll()
    return logs
  }
}
