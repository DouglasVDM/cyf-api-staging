import Dao from '../../../../libraries/dao'
import ApplicantProgress from './schema'

export default class ApplicantProgressDao extends Dao {
  constructor() {
    super(ApplicantProgress)
  }

  async create(set) {
    const applicantProgress = new ApplicantProgress(set)
    return applicantProgress.save()
  }
}
