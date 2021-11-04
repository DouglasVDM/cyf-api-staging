import FeedbackService from './service'

const feedbackService = new FeedbackService()
export default {
  findAll: () => feedbackService.findAll(),
  create: feedback => feedbackService.create(feedback)
}
