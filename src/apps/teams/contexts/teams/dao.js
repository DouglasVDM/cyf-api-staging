import Dao from '../../../../libraries/dao'
import Teams from './schema'

export default class TeamsDao extends Dao {
  constructor() {
    super(Teams)
  }

  async create(data) {
    const teams = new Teams(data)
    return teams.save()
  }
}
