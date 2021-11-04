import ExpensesService from './service'

const expensesService = new ExpensesService()

export default {
  findBy: query => expensesService.findBy(query),
  findById: (id, projection) => expensesService.findById(id, projection),
  create: data => expensesService.create(data),
  findOneAndUpdate: (query, set) =>
    expensesService.findOneAndUpdate(query, set),
  findAll: (query, proj) => expensesService.findAll(query, proj),
  hardDelete: query => expensesService.hardDelete(query)
}
