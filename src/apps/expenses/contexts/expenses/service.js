import ExpensesDao from './dao'

export default class ExpensesService {
  constructor() {
    this.expensesDao = new ExpensesDao()
  }
  async findBy(query) {
    const event = await this.expensesDao.findOneBy(query)
    return event
  }
  async findById(id, projection) {
    const events = await this.expensesDao.findById(id, projection)
    return events
  }
  async create(data) {
    return this.expensesDao.create(data)
  }

  async findOneAndUpdate(query, set) {
    return this.expensesDao.findOneAndUpdate(query, set)
  }

  async findAll(query, proj) {
    return this.expensesDao.findAll(query, proj)
  }

  async hardDelete(query) {
    return this.expensesDao.hardDelete(query)
  }
}
