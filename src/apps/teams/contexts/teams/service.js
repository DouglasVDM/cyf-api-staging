import TeamsDao from './dao'

export default class TeamsService {
  constructor() {
    this.teamsDao = new TeamsDao()
  }

  async show(id) {
    const team = await this.teamsDao.findOneBy(id)
    return team
  }

  async findById(id, projection) {
    const teams = await this.teamsDao.findById(id, projection)
    return teams
  }

  async create(data) {
    return this.teamsDao.create(data)
  }

  async findOneAndUpdate(query, set) {
    return this.teamsDao.findOneAndUpdate(query, set)
  }

  async findAll(query, proj) {
    return this.teamsDao.findAll(query, proj)
  }

  async hardDelete(query) {
    return this.teamsDao.hardDelete(query)
  }
}
