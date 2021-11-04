import Dao from '../../../../libraries/dao'
import Classes from './schema'

export default class ClassesDao extends Dao {
  constructor() {
    super(Classes)
  }

  async create(set) {
    const classes = new Classes(set)
    return classes.save()
  }
}
