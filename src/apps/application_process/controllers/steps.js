import StepsContext from '../contexts/steps'
import ApplicantProgress from '../contexts/applicant_progress'
import { logError } from '../../common/contexts/log'
import {
  getStepByUserIdAndStepId,
  addURLToApplicantStep,
  showApplicantByUserId,
  mergeApplicantProgressWithSteps
} from '../helpers/utils'
import { urlApprovalNotification } from '../helpers/emailNotifications'
import { updateApplicantStepCache } from '../helpers/updateRedis'
import { getCityFromCache } from '../../../useCases/CacheUtils'
import { deleteFile } from '../../helpers/deleteFileS3'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
export const createStep = async (req, res) => {
  try {
    const stepData = {
      ...req.body,
      eligibilityToDate: dayjs
        .utc(req.body.eligibilityToDate)
        .endOf('day')
        .toDate(),
      eligibilityFromDate: dayjs
        .utc(req.body.eligibilityFromDate)
        .startOf('day')
        .toDate()
    }
    const step = await StepsContext.create(stepData)
    res.status(200).send({
      step
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not create Step.')
  }
}
export const getSteps = async (req, res) => {
  try {
    const steps = await StepsContext.findAll()
    res.status(200).send({
      steps
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get Steps.')
  }
}

export const insertUrlToStep = async (req, res) => {
  const { userId, stepUrl, stepId } = req.body
  const data = {
    userId,
    stepUrl,
    stepId,
    user: req.user
  }
  try {
    const { city, step, creatStep } = await addURLToApplicantStep(data)
    if (!step && creatStep && city) {
      return res.status(200).send({
        step: creatStep
      })
    }
    if (city) {
      return res.status(200).send({
        step
      })
    }
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not insert Url to Step.')
  }
}
export const getStep = async (req, res) => {
  const { id } = req.params
  try {
    const mergedStep = await getStepByUserIdAndStepId(id, req.user.userId)
    return res.status(200).send(mergedStep)
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Step.')
  }
}

export const updateUrl = async (req, res) => {
  const { userId, stepId, urlId, status } = req.body.urlData
  const { email } = req.body
  const { _id, fullName } = req.user
  try {
    const step = await ApplicantProgress.findOneAndUpdate(
      {
        userId,
        stepId,
        urls: { $elemMatch: { _id: urlId } }
      },
      {
        $set: {
          'urls.$.status': status,
          'urls.$.updatedAt': new Date(),
          'urls.$.reviewerUserId': _id,
          'urls.$.reviewerFullName': fullName
        },
        status
      }
    )
    const applicant = await showApplicantByUserId(userId)
    const city = await getCityFromCache(applicant.cityId)
    // send notification to applicant
    await urlApprovalNotification(email, stepId, status, city.email)
    const mergeStep = await mergeApplicantProgressWithSteps(step)
    await updateApplicantStepCache(mergeStep)
    return res.status(200).send({
      step: mergeStep
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not update Url.')
  }
}

export const editStep = async (req, res) => {
  try {
    const { _id, stepData } = req.body
    const step = await StepsContext.findOneAndUpdate(
      { _id },
      {
        ...stepData,
        eligibilityToDate: dayjs
          .utc(req.body.stepData.eligibilityToDate)
          .endOf('day')
          .toDate(),
        eligibilityFromDate: dayjs
          .utc(req.body.stepData.eligibilityFromDate)
          .startOf('day')
          .toDate()
      }
    )
    return res.status(200).send({
      step
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not update Step.')
  }
}

export const editApplicantProgress = async (req, res) => {
  try {
    const { query, applicantProgressData } = req.body
    const { fullName, _id } = req.user
    let step
    step = await ApplicantProgress.findOneAndUpdate(query, {
      ...applicantProgressData,
      $addToSet: {
        reviewer: [
          {
            reviewerUserId: _id,
            reviewerFullName: fullName,
            reviewedAt: new Date(),
            action: applicantProgressData
          }
        ]
      }
    })
    if (!step) {
      step = await ApplicantProgress.create({
        ...query,
        ...applicantProgressData,
        $addToSet: {
          reviewer: [
            {
              reviewerUserId: _id,
              reviewerFullName: fullName,
              reviewedAt: new Date(),
              action: applicantProgressData
            }
          ]
        }
      })
    }
    const mergeStep = await mergeApplicantProgressWithSteps(step)
    await updateApplicantStepCache(mergeStep)
    return res.status(200).send({
      step: mergeStep
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not update Step.')
  }
}

export const deleteImageFromApplicantProgress = async (req, res) => {
  try {
    let step
    const { stepId, url } = req.body
    const filename = url.substring(url.lastIndexOf('/') + 1)
    const lookUpStep = await ApplicantProgress.findOneAndUpdate({
      stepId,
      userId: req.user.userId,
      urls: { $elemMatch: { url } }
    })
    if (lookUpStep) {
      await deleteFile(filename)
      step = await ApplicantProgress.findOneAndUpdate(
        { stepId, userId: req.user.userId },
        {
          $pull: {
            urls: {
              url
            }
          }
        }
      )
    }
    const mergeStep = await mergeApplicantProgressWithSteps(step)
    await updateApplicantStepCache(mergeStep)
    return res.status(200).send({
      step: mergeStep
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not delete image.')
  }
}
