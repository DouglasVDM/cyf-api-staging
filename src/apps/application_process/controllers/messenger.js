import ApplicantProgress from '../contexts/applicant_progress'
import { logError } from '../../common/contexts/log'
import { emailNotificatinOnCommentsInApplicationProcess } from '../helpers/emailNotifications'
import { createMessageHelper } from '../helpers/utils'

export const createMessage = async (req, res) => {
  const { body, user, headers } = req
  try {
    const step = await createMessageHelper(req.body, req.user)
    await emailNotificatinOnCommentsInApplicationProcess(body, user, headers)
    return res.status(200).send({
      step
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create Message.')
  }
}
export const editMessage = async (req, res) => {
  try {
    const { _id, message } = req.body
    const { messageId, editedMessage } = message
    const step = await ApplicantProgress.findOneAndUpdate(
      {
        _id,
        message: { $elemMatch: { _id: messageId } }
      },
      { $set: { 'message.$.message': editedMessage } }
    )
    return res.status(200).send({
      step
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not edit sMessage.')
  }
}
