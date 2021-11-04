import Dao from '../../../../libraries/dao'
import Lists from './schema'

export default class listsDao extends Dao {
  constructor() {
    super(Lists)
  }
  async create(set) {
    const lists = new Lists(set)
    return lists.save()
  }
}
