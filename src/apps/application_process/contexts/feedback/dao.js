import Dao from '../../../../libraries/dao'
import FeedbackModel from './schema'

export default class FeedbackDao extends Dao {
  constructor() {
    super(FeedbackModel)
  }

  async create(Feedback) {
    const feedback = new FeedbackModel(Feedback)
    return feedback.save()
  }
}
