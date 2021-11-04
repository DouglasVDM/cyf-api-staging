import ApplicantProgress from '../contexts/applicant_progress'

export const _createFeedbackPoint = async (body, user) => {
  const { feedbackPoints, userId, progressId } = body
  const { _id } = user
  const _feedbackPoints = feedbackPoints.map(feedbackPoint => {
    return {
      text: feedbackPoint.text,
      done: feedbackPoint.done,
      accepted: feedbackPoint.accepted,
      userId: _id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  })
  try {
    return ApplicantProgress.findOneAndUpdate(
      {
        _id: progressId,
        userId
      },
      {
        feedbackPoints: _feedbackPoints
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}
export const _editFeedbackPoint = async body => {
  const { userId, stepId, feedbackPoints } = body
  try {
    return ApplicantProgress.findOneAndUpdate(
      {
        userId,
        stepId
      },
      {
        feedbackPoints
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}
