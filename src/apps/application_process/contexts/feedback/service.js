import FeedbackDao from './dao'

export default class FeedbackService {
  constructor() {
    this.feedbackDao = new FeedbackDao()
  }

  async findAll() {
    const feedbacks = await this.feedbackDao.findAll()
    return feedbacks
  }

  async create(feedbackData) {
    return this.feedbackDao.create(feedbackData)
  }
}
