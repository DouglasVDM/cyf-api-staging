import Dao from '../../../../libraries/dao'
import Events from './schema'

export default class EventsDao extends Dao {
  constructor() {
    super(Events)
  }

  async create(data) {
    const events = new Events(data)
    return events.save()
  }
}
