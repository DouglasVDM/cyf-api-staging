import Dao from '../../../../libraries/dao'
import Expenses from './schema'

export default class ExpensesDao extends Dao {
  constructor() {
    super(Expenses)
  }

  async create(data) {
    const expenses = new Expenses(data)
    return expenses.save()
  }
}
