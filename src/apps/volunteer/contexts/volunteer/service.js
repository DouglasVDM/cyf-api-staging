import VolunteersDao from './dao'

export default class VolunteersService {
  constructor() {
    this.volunteersDao = new VolunteersDao()
  }

  async findOneBy(id) {
    const Volunteer = await this.volunteersDao.findOneBy(id)
    return Volunteer
  }

  async findById(id, projection) {
    const Volunteers = await this.volunteersDao.findById(id, projection)
    return Volunteers
  }

  async create(data) {
    return this.volunteersDao.create(data)
  }

  async findOneAndUpdate(query, set) {
    return this.volunteersDao.findOneAndUpdate(query, set)
  }
  async findOneByEmail(query) {
    // if volunteer exists, return it
    // if not, create it
    const lookupVolunteer = await this.volunteersDao.findOneBy({
      email: query.email
    })
    return lookupVolunteer
  }

  async findOneOrCreate(query, set) {
    // if volunteer exists, Update and return it
    // if not, create it
    const lookupVolunteer = await this.volunteersDao.findOneAndUpdate(
      query,
      set
    )
    if (lookupVolunteer) {
      return lookupVolunteer
    }
    return this.volunteersDao.create(set)
  }

  async findAll(query, proj) {
    return this.volunteersDao.findAll(query, proj)
  }

  async hardDelete(query) {
    return this.volunteersDao.hardDelete(query)
  }
}
