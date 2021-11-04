import ListsDao from './dao'

export class ListsService {
  constructor() {
    this.listsDao = new ListsDao()
  }
  async findOrCreate(set) {
    const { _id } = set
    let lists
    lists = await this.listsDao.findOneBy({ _id })
    if (lists) {
      lists.previouslyExisted = true
      return lists
    }
    lists = await this.listsDao.create(set)
    return lists
  }
  async findById(_id, projection) {
    return this.listsDao.findById(_id, projection)
  }
  async findOneAndUpdate(query, set) {
    return this.listsDao.findOneAndUpdate(query, set)
  }
  async findAll(query, projection) {
    return this.listsDao.findAll(query, projection)
  }
  async findOneBy(lists) {
    return this.listsDao.findOneBy(lists)
  }
  async deleteById(id) {
    return this.listsDao.hardDelete(id)
  }
}
const listsService = new ListsService()
export default {
  findOrCreate: listsDetails => listsService.findOrCreate(listsDetails),
  findById: (id, projection) => listsService.findById(id, projection),
  findOneAndUpdate: (query, set) => listsService.findOneAndUpdate(query, set),
  findAll: (query, projection) => listsService.findAll(query, projection),
  findOneBy: query => listsService.findOneBy(query),
  deleteById: id => listsService.deleteById(id)
}
