import UserDao from './dao'

export class UserService {
  constructor() {
    this.userDao = new UserDao()
  }

  async findOrCreateAdminUser(userDetails) {
    const { email = '', githubId = '' } = userDetails
    let user
    if (githubId) {
      user = await this.userDao.findOneBy({ githubId })
    } else {
      user = await this.userDao.findOneBy({ email })
    }
    if (!user) {
      user = await this.userDao.create({
        ...userDetails,
        adminStatus: 'PENDING'
      })
      user.newAdmin = true
    }
    if (!user.adminStatus) {
      user = await this.userDao.findOneAndUpdate(
        { _id: user._id },
        {
          ...userDetails,
          adminStatus: 'PENDING'
        }
      )
      user.newAdmin = true
    }
    return user
  }

  async findOrCreateUserForStudent(userDetails) {
    const { email = '', githubId = '' } = userDetails
    const findOptions = { $or: [{ email }, { githubId }] }
    let user
    user = await this.userDao.findOneBy(findOptions)
    if (!user) {
      user = await this.userDao.create(userDetails)
    }
    return user
  }

  async findOrCreateUserForVolunteer(userDetails) {
    const { email, userId } = userDetails
    let user
    if (userId) {
      user = await this.userDao.findOneBy({ _id: userId })
    } else {
      user = await this.userDao.findOneBy({ email })
    }
    if (user) {
      return this.userDao.findOneAndUpdate({ _id: user._id }, userDetails)
    }
    user = await this.userDao.create(userDetails)
    return user
  }

  async findOrCreateUser(userDetails) {
    const { email } = userDetails
    let user
    user = await this.userDao.findOneBy({ email })
    if (user) {
      user.previouslyExisted = true
      return user
    }
    user = await this.userDao.create(userDetails)
    return user
  }

  async findById(_id, projection) {
    const user = await this.userDao.findById(_id, projection)
    return user
  }

  async findOneAndUpdate(query, set) {
    return this.userDao.findOneAndUpdate(query, set)
  }

  async findAll(query, projection) {
    return this.userDao.findAll(query, projection)
  }

  async showEmail(email) {
    return this.userDao.findOneBy(email)
  }
  async deleteById(id) {
    return this.userDao.hardDelete(id)
  }
}
const userService = new UserService()
export default {
  findOrCreateUserForStudent: userDetails =>
    userService.findOrCreateUserForStudent(userDetails),
  findOrCreateUser: userDetails => userService.findOrCreateUser(userDetails),
  findOrCreateAdminUser: userDetails =>
    userService.findOrCreateAdminUser(userDetails),
  findOrCreateUserForVolunteer: userDetails =>
    userService.findOrCreateUserForVolunteer(userDetails),
  findById: (id, projection) => userService.findById(id, projection),
  findOneAndUpdate: (query, set) => userService.findOneAndUpdate(query, set),
  findAll: (query, projection) => userService.findAll(query, projection),
  showEmail: email => userService.showEmail(email),
  deleteById: id => userService.deleteById(id)
}
