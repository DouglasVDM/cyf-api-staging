import VolunteersService from './service'

const volunteersService = new VolunteersService()

export default {
  findOneBy: id => volunteersService.findOneBy(id),
  findById: (id, projection) => volunteersService.findById(id, projection),
  create: data => volunteersService.create(data),
  findOneAndUpdate: (query, set) =>
    volunteersService.findOneAndUpdate(query, set),
  findOneOrCreate: (query, set) =>
    volunteersService.findOneOrCreate(query, set),
  findAll: (query, proj) => volunteersService.findAll(query, proj),
  hardDelete: query => volunteersService.hardDelete(query),
  findOneByEmail: query => volunteersService.findOneByEmail(query)
}
