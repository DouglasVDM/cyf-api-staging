import AdminDao from './dao'
import UserDao from '../user/dao'

export default class AdminService {
  constructor() {
    this.adminDao = new AdminDao()
    this.userDao = new UserDao()
  }

  async show(userId) {
    const admin = await this.adminDao.findOneBy(userId)
    return admin
  }

  async create(adminData) {
    const { userId, email } = adminData
    const user = await this.userDao.findOneBy({ _id: userId })
    if (user) {
      const Checks = [
        await this.adminDao.findOneBy({ userId }),
        await this.adminDao.findOneBy({ email: email.toLowerCase() })
      ]
      if (Checks.join('') === '') {
        // I assigned the admiDao to adminDataCopy to avoid eslint error " Assignment to property of function parameter 'adminData' "
        const adminDataCopy = this.adminDao

        adminDataCopy.adminStatus = 'PENDING'
        return this.adminDao.create(adminData)
      }
      throw new Error('A user with these details already exists.')
    }
    throw new Error('Application not allowed.')
  }

  async findOneAndUpdate(query, set) {
    return this.adminDao.findOneAndUpdate(query, set)
  }

  async findAll() {
    return this.adminDao.findAll()
  }
}
