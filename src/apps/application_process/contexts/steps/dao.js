import Dao from '../../../../libraries/dao'
import Steps from './schema'

export default class StepsDao extends Dao {
  constructor() {
    super(Steps)
  }

  async create(stepsData) {
    const steps = new Steps(stepsData)
    return steps.save()
  }
}
