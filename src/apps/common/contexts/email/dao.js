import Dao from '../../../../libraries/dao'
import Email from './schema'

export default class emailDao extends Dao {
  constructor() {
    super(Email)
  }

  async create(set) {
    const email = new Email(set)
    return email.save()
  }
}
