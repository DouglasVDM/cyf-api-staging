import StudentDao from './dao'

export default class StudentService {
  constructor() {
    this.studentDao = new StudentDao()
  }

  async findOneStudent(query) {
    return this.studentDao.findOneBy(query)
  }

  async showEmail(email) {
    return this.studentDao.findOneBy(email)
  }

  async aggregate(pipeline, options) {
    return this.studentDao.aggregate(pipeline, options)
  }

  async create(studentData) {
    const { userId } = studentData
    const student = await this.studentDao.findOneBy({ userId })
    if (student) {
      throw new Error('Student with given details already exists')
    }
    return this.studentDao.create(studentData)
  }

  async findOneAndUpdate(query, set) {
    return this.studentDao.findOneAndUpdate(query, set)
  }

  async findStudents(query, projection, populate, options) {
    return this.studentDao.findBy(query, projection, populate, options)
  }

  async findAll(query, skip = null, limit = null) {
    return this.studentDao.findBy(query, {}, null, {
      limit,
      skip,
      sort: {
        admin: -1
      }
    })
  }

  async hardDelete(query) {
    return this.studentDao.hardDelete(query)
  }
}
