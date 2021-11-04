import Dao from '../../../../libraries/dao'
import Targets from './schema'

export default class TargetsDao extends Dao {
  constructor() {
    super(Targets)
  }

  async create(data) {
    const targets = new Targets(data)
    return targets.save()
  }
}
