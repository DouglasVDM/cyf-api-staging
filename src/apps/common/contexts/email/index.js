import EmailDao from './dao'

export class EmailService {
  constructor() {
    this.emailDao = new EmailDao()
  }
  async findOrCreate(set) {
    const { _id } = set
    let email
    email = await this.emailDao.findOneBy({ _id })
    if (email) {
      email.previouslyExisted = true
      return email
    }
    email = await this.emailDao.create(set)
    return email
  }

  async findById(_id, projection) {
    return this.emailDao.findById(_id, projection)
  }

  async findOneAndUpdate(query, set) {
    return this.emailDao.findOneAndUpdate(query, set)
  }

  async findAll(query, projection) {
    return this.emailDao.findAll(query, projection)
  }

  async findOneBy(email) {
    return this.emailDao.findOneBy(email)
  }
  async deleteById(id) {
    return this.emailDao.hardDelete(id)
  }
}
const emailService = new EmailService()
export default {
  findOrCreate: emailDetails => emailService.findOrCreate(emailDetails),
  findById: (id, projection) => emailService.findById(id, projection),
  findOneAndUpdate: (query, set) => emailService.findOneAndUpdate(query, set),
  findAll: (query, projection) => emailService.findAll(query, projection),
  findOneBy: query => emailService.findOneBy(query),
  deleteById: id => emailService.deleteById(id)
}
