import AppsDao from './dao'

export default class AppsService {
  constructor() {
    this.appsDao = new AppsDao()
  }

  async show(id) {
    const apps = await this.appsDao.findOneBy(id)
    return apps
  }

  async findBy(query, set) {
    const apps = await this.appsDao.findBy(query, set)
    return apps
  }

  async create(set) {
    return this.appsDao.create(set)
  }

  async findOneAndUpdate(query, set) {
    return this.appsDao.findOneAndUpdate(query, set)
  }

  async hardDelete(query) {
    const apps = await this.appsDao.hardDelete(query)
    return apps
  }

  async findAll() {
    const apps = await this.appsDao.findAll()
    return apps
  }
}
