import StepsDao from './dao'

export default class StepsService {
  constructor() {
    this.stepsDao = new StepsDao()
  }

  async findOneBy(query, projection, populate, options) {
    const step = await this.stepsDao.findOneBy(
      query,
      projection,
      populate,
      options
    )
    return step
  }

  async findBy(query, set) {
    const steps = await this.stepsDao.findBy(query, set)
    return steps
  }

  async create(stepsData) {
    return this.stepsDao.create(stepsData)
  }

  async findOneAndUpdate(query, set) {
    return this.stepsDao.findOneAndUpdate(query, set)
  }

  async hardDelete(query) {
    const steps = await this.stepsDao.hardDelete(query)
    return steps
  }

  async findAll() {
    const steps = await this.stepsDao.findAll()
    return steps
  }
}
