import Dao from '../../../../libraries/dao'
import Volunteer from './schema'

export default class VolunteerDao extends Dao {
  constructor() {
    super(Volunteer)
  }

  async create(data) {
    const volunteer = new Volunteer(data)
    return volunteer.save()
  }
}
