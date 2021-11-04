import Dao from '../../../../libraries/dao'
import Apps from './schema'

export default class AppsDao extends Dao {
  constructor() {
    super(Apps)
  }

  async create(set) {
    const apps = new Apps(set)
    return apps.save()
  }
}
