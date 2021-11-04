import UserContext from '../../common/contexts/user'
import { ADMIN_STATUS } from '../../common/contexts/user/schema'
import { logError } from '../../common/contexts/log'
import {
  getListOfApplicantsByQuery,
  getAllApplicantsForCSV,
  getAdminByUserId,
  getListOfAdmins,
  removeStudent,
  recordStudentCallStatus,
  undoStudentCallStatus,
  editStudentCallStatus,
  recordStudentWorkshopsStatus,
  deleteStudentWorkshopsStatus,
  editStudentWorkshopsStatus,
  mergeApplicantProgressWithSteps
} from '../helpers/utils'
import {
  updateApplicantCache,
  updateApplicantStepCache
} from '../helpers/updateRedis'
import { filterApplicantsByQuery } from '../helpers/filters'
import { _createFeedbackPoint, _editFeedbackPoint } from '../useCases/steps'

export const getSingleAdmin = async (req, res) => {
  try {
    if (!req.user) {
      // TODO should probably be 422
      return res.sendStatus(401)
    }
    const admin = await getAdminByUserId(req.user._id)
    return res.status(200).send({
      admin
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not find admin.')
  }
}

export async function createAdmin(req, res) {
  try {
    const adminData = req.body.admin
    const { _id } = req.body
    await UserContext.findOneAndUpdate(
      { _id },
      {
        ...adminData,
        admin: true,
        adminStatus: ADMIN_STATUS.pending
      }
    )
    return res.status(200).send({
      msg:
        'You successfully applied in our app, Adminstration will update your profile then you can login.'
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create Admin.')
  }
}

export const getListOfApplicants = async (req, res) => {
  try {
    const applicants = await getListOfApplicantsByQuery(req.query, req.user)
    const results = await filterApplicantsByQuery(req.query, applicants)
    // eslint-disable-next-line require-atomic-updates
    res.cached = results.cached
    if (results && results.length === 0) {
      return res.status(200).send({
        applicants: [],
        msg: 'No entries found for your selection 🤷‍'
      })
    }
    return res.status(200).send({
      applicants: results
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Applicants.')
  }
}

export const getAdmins = async (req, res) => {
  try {
    const results = await getListOfAdmins()
    res.cached = results.cached
    return res.status(200).send({
      admins: results.admins
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get admins.')
  }
}

export const removeApplicant = async (req, res) => {
  try {
    const applicant = await removeStudent(req)
    return res.status(200).send({
      ...applicant.deletedApplicant
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not remove Applicant.')
  }
}

export const getApplicantsForCSV = async (req, res) => {
  try {
    const applicants = await getAllApplicantsForCSV()
    return res.status(200).send({
      applicants
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get Applicants.')
  }
}
export const setCallStatus = async (req, res) => {
  const { userId } = req.params
  try {
    const applicant = await recordStudentCallStatus(userId, req.body, req.user)
    await updateApplicantCache(applicant)
    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get record.')
  }
}

// removing a call to student
export const removeCallToStudent = async (req, res) => {
  const { userId } = req.params
  const { callId } = req.body
  try {
    const applicant = await undoStudentCallStatus(userId, callId)
    await updateApplicantCache(applicant)
    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get record.')
  }
}

// updating a call to student comment
export const editCallToStudent = async (req, res) => {
  const { userId } = req.params
  const { callId, newComment, newStatus } = req.body.data
  try {
    const applicant = await editStudentCallStatus(
      userId,
      callId,
      newComment,
      newStatus
    )
    await updateApplicantCache(applicant)

    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get record.')
  }
}

export const setWorkshopsStatus = async (req, res) => {
  const { userId } = req.params
  try {
    const applicant = await recordStudentWorkshopsStatus(
      userId,
      req.body,
      req.user
    )
    await updateApplicantCache(applicant)
    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get record.')
  }
}

// removing a  student workshop
export const removeWorkshopsStatus = async (req, res) => {
  const { userId } = req.params
  const { workshopId } = req.body
  try {
    const applicant = await deleteStudentWorkshopsStatus(userId, workshopId)
    await updateApplicantCache(applicant)
    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get record.')
  }
}

// updating a call to student comment
export const updateWorkshopsStatus = async (req, res) => {
  const { userId } = req.params
  const { workshopId, newComment, newStatus } = req.body.data
  try {
    const applicant = await editStudentWorkshopsStatus(
      userId,
      workshopId,
      newComment,
      newStatus
    )
    await updateApplicantCache(applicant)

    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get record.')
  }
}

export const createFeedbackPoint = async (req, res) => {
  try {
    const step = await _createFeedbackPoint(req.body, req.user)
    const mergeStep = await mergeApplicantProgressWithSteps(step)
    await updateApplicantStepCache(mergeStep)

    return res.status(200).send({
      step: mergeStep
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not create feedback points.')
  }
}
export const editFeedbackPoint = async (req, res) => {
  try {
    const step = await _editFeedbackPoint(req.body)
    const mergeStep = await mergeApplicantProgressWithSteps(step)
    await updateApplicantStepCache(mergeStep)
    return res.status(200).send({
      step: mergeStep
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not create feedback points.')
  }
}
