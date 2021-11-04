import ApplicantProgressServiceDao from './dao'

export default class ApplicantProgressServiceService {
  constructor() {
    this.applicantProgressServiceDao = new ApplicantProgressServiceDao()
  }

  async findBy(id) {
    const steps = await this.applicantProgressServiceDao.findBy(id)
    return steps
  }
  async findOneBy(query) {
    return this.applicantProgressServiceDao.findOneBy(query)
  }
  async create(set) {
    return this.applicantProgressServiceDao.create(set)
  }

  async findOneAndUpdate(query, set) {
    return this.applicantProgressServiceDao.findOneAndUpdate(query, set)
  }

  async findAll() {
    const applicantProgressServices = await this.applicantProgressServiceDao.findAll()
    return applicantProgressServices
  }

  async hardDelete(query) {
    const applicantProgressService = await this.applicantProgressServiceDao.hardDelete(
      query
    )
    return applicantProgressService
  }
}
