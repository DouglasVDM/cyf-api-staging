import Dao from '../../../../libraries/dao'
import Logs from './schema'

export default class LogsDao extends Dao {
  constructor() {
    super(Logs)
  }

  async create(set) {
    try {
      if (set) {
        const newLog = new Logs(set)
        return newLog.save()
      }
      return null
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log({ err })
      return err
    }
  }
}
