import ClassesDao from './dao'

export default class ClassesService {
  constructor() {
    this.classesDao = new ClassesDao()
  }

  async show(id) {
    const classes = await this.classesDao.findOneBy(id)
    return classes
  }

  async findBy(query, set) {
    const classes = await this.classesDao.findBy(query, set)
    return classes
  }

  async create(set) {
    return this.classesDao.create(set)
  }

  async findOneAndUpdate(query, set) {
    return this.classesDao.findOneAndUpdate(query, set)
  }

  async hardDelete(query) {
    const classes = await this.classesDao.hardDelete(query)
    return classes
  }

  async findAll() {
    const classes = await this.classesDao.findAll()
    return classes
  }
}
