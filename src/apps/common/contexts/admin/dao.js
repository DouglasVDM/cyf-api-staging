import Dao from '../../../../libraries/dao'
import AdminModel from './schema'

export default class AdminDao extends Dao {
  constructor() {
    super(AdminModel)
  }

  async create(adminData) {
    const admin = new AdminModel(adminData)
    return admin.save()
  }
}
