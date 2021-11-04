import FeedbackContext from '../contexts/feedback'
import { logError } from '../../common/contexts/log'

export const createFeedback = async (req, res) => {
  try {
    const feedbackData = req.body
    const feedback = await FeedbackContext.create(feedbackData)
    return res.status(200).send({
      feedback
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create Feadback.')
  }
}

export const getFeedback = async (req, res) => {
  try {
    const feedbacks = await FeedbackContext.findAll()
    return res.status(200).send({
      feedbacks
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Feedback.')
  }
}
