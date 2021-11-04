import StudentContext from '../contexts/students'
import StepContext from '../contexts/steps'
import StudentProgress from '../contexts/applicant_progress'
import UserContext from '../../common/contexts/user'
import { STUDENT_CATEGORIES } from '../contexts/students/schema'
import config from '../../../config'
import JwtTokenCreator from '../../helpers/jwtTokenCreator'
import StepsContext from '../contexts/steps'
import ApplicantProgress from '../contexts/applicant_progress'
import tokenDecoder from '../../helpers/tokenDecoder'
import {
  urlStep4SubmittedNotifications,
  urlStepsSubmittedNotifications
} from '../helpers/emailNotifications'
import { getCityFromCache } from '../../../useCases/CacheUtils'
import _ from 'lodash'
import {
  registrationNotificationsToCYF,
  registrationNotificationsToStudent
} from './emailNotifications'
import {
  setCacheDataByQuery,
  getDataFromCacheByQuery
} from '../../helpers/redis'
import {
  updateApplicantStepCache,
  removeApplicantFromCache,
  addNewApplicantToCache
} from './updateRedis'
import { logActions } from '../../common/contexts/log'

const TWENTY_FOUR_HOURS = 86400000

export async function createApplicant(applicantDetails) {
  try {
    const studentExist = await StudentContext.findOneStudent({
      userId: applicantDetails.userId
    })
    if (studentExist) {
      throw new Error('EMAIL_USED')
    }
    const user = await UserContext.findOneAndUpdate(
      { _id: applicantDetails.userId },
      { ...applicantDetails }
    )
    if (!user) {
      throw new Error('NO_USER')
    }
    const applicant = await StudentContext.create({
      ...applicantDetails,
      email: user.email
    })
    if (applicant.userId) {
      const city = await getCityFromCache(user.cityId)
      // send a message to CYF email about new applicant
      registrationNotificationsToCYF(applicant, city.email)
      // send a welcome massage to applicant email
      registrationNotificationsToStudent(applicant, city.email)
      //update cache
      const ApplicantWithData = await getStudentsData({
        ...user,
        ...applicant._doc
      })
      addNewApplicantToCache(ApplicantWithData)
    }
    return await JwtTokenCreator(applicant)
  } catch (err) {
    throw new Error(err.message)
  }
}

//used to get step to merge with applicant progress
export async function mergeApplicantProgressWithSteps(_applicantProgress) {
  const step = await StepContext.findOneBy(
    {
      _id: _applicantProgress.stepId
    },
    {
      number: 1,
      optional: 1,
      name: 1,
      header: 1,
      acceptanceCriteria: 1,
      category: 1,
      showImageUpload: 1,
      showSubmitUrl: 1,
      showMotivationalLetter: 1
    }
  )
  return {
    status: _applicantProgress.status,
    _id: _applicantProgress._id,
    userId: _applicantProgress.userId,
    country: _applicantProgress.country,
    stepId: _applicantProgress.stepId,
    messages: _applicantProgress.messages,
    urls: _applicantProgress.urls,
    createdAt: _applicantProgress.createdAt,
    updatedAt: _applicantProgress.updatedAt,
    number: step.number,
    optional: step.optional,
    name: step.name,
    header: step.header,
    showImageUpload: step.showImageUpload,
    showMotivationalLetter: step.showMotivationalLetter,
    showSubmitUrl: step.showSubmitUrl,
    category: step.category,
    motivationalLetter: _applicantProgress.motivationalLetter,
    reviewer: _applicantProgress.reviewer,
    feedbackPoints:
      _applicantProgress.feedbackPoints &&
      Array.isArray(_applicantProgress.feedbackPoints) &&
      _applicantProgress.feedbackPoints.length > 0
        ? _applicantProgress.feedbackPoints
        : step.acceptanceCriteria
  }
}

// used to get applicant progress by stepId and userId
async function getStepByUserIdAndStep(step, applicant) {
  const progress = await ApplicantProgress.findOneBy({
    userId: applicant.userId,
    stepId: step._id
  })
  return {
    userId: applicant.userId,
    country: applicant.country,
    stepId: step._id,
    number: step.number,
    status: progress ? progress.status : '',
    motivation: step.motivation,
    urls: progress ? progress.urls : [],
    optional: step.optional,
    messages: progress ? progress.messages : [],
    createdAt: progress ? progress.createdAt : '',
    updatedAt: progress ? progress.updatedAt : '',
    name: step.name,
    header: step.header,
    description: step.description,
    instructions: step.instructions,
    image: step.image,
    device: step.device,
    showMotivationalLetter: step.showMotivationalLetter,
    showSubmitUrl: step.showSubmitUrl,
    category: step.category,
    motivationalLetter: progress && progress.motivationalLetter,
    reviewer: progress && progress.reviewer,
    youTubEmbedVideo: step.youTubEmbedVideo,
    feedbackPoints:
      progress &&
      progress.feedbackPoints &&
      Array.isArray(progress.feedbackPoints) &&
      progress.feedbackPoints.length > 0
        ? progress.feedbackPoints
        : step.acceptanceCriteria
  }
}

export async function showApplicantByUserId(userId) {
  try {
    const user = await UserContext.findById({ _id: userId })
    const applicant = await StudentContext.findOneStudent({ userId })
    let Steps
    let resultSteps
    if (applicant) {
      Steps = await StepsContext.findBy({
        eligibilityFromDate: {
          $lt: applicant.createdAt
        },
        eligibilityToDate: {
          $gte: applicant.createdAt
        }
      })
      resultSteps = await Promise.all(
        Steps.map(step => getStepByUserIdAndStep(step, applicant))
      )
    }
    return {
      ...user,
      ...applicant,
      steps: resultSteps
    }
  } catch (err) {
    throw new Error(err)
  }
}

export async function loginWithMagicLinkHelper(token) {
  const authorizationToken = token
  const checkedToken = tokenDecoder(authorizationToken)
  if (checkedToken.message === 'TOKEN_EXPIRED') {
    throw new Error('Failed')
  }
  const user = await UserContext.showEmail({
    email: checkedToken.email
  })
  if (user.token === authorizationToken) {
    const applicant = await StudentContext.showEmail({
      email: checkedToken.email
    })
    user.userId = user._id.toJSON()
    const tokenForApplicant = await JwtTokenCreator(applicant)
    return `${config.applicationProcessClientUrl}/log-in/${tokenForApplicant}`
  }
  return `${config.applicationProcessClientUrl}/authentication-failed`
}

export async function createMessageHelper(requestBody, requestUser) {
  try {
    const { message, stepId, userId } = requestBody
    let step
    step = await ApplicantProgress.findOneAndUpdate(
      { userId, stepId },
      {
        $addToSet: {
          messages: [
            {
              message,
              senderName: requestUser.fullName,
              createdAt: new Date(),
              userId,
              senderId: requestUser._id
            }
          ]
        }
      }
    )
    if (!step) {
      step = await ApplicantProgress.create({
        userId,
        stepId,
        urls: [],
        messages: [
          {
            message,
            senderName: requestUser.fullName,
            createdAt: new Date(),
            userId,
            senderId: requestUser._id
          }
        ]
      })
    }
    const mergeStep = await mergeApplicantProgressWithSteps(step)
    await updateApplicantStepCache(mergeStep)
    return mergeStep
  } catch (err) {
    throw new Error(err)
  }
}

//user to get step for applicant step page in application process
export async function getStepByUserIdAndStepId(id, userId) {
  const step = await StepsContext.findBy({ _id: id })
  const progress = await ApplicantProgress.findBy({
    userId: userId,
    stepId: id
  })
  const noProgress = progress.length > 0
  const mergedStep = {
    userId: userId,
    stepId: step[0]._id,
    number: step[0].number,
    status: noProgress ? progress[0].status : 'Not submitted',
    urls: noProgress ? progress[0].urls : [],
    optional: step[0].optional,
    messages: noProgress ? progress[0].messages : [],
    createdAt: noProgress ? progress[0].createdAt : '',
    updatedAt: noProgress ? progress[0].updatedAt : '',
    name: step[0].name,
    header: step[0].header,
    description: step[0].description,
    instructions: step[0].instructions,
    showImageUpload: step[0].showImageUpload,
    showMotivationalLetter: step[0].showMotivationalLetter,
    showSubmitUrl: step[0].showSubmitUrl,
    category: step[0].category,
    motivationalLetter: noProgress ? progress[0].motivationalLetter : '',
    reviewer: noProgress ? progress[0].reviewer : [],
    image: step[0].image,
    youTubEmbedVideo: step[0].youTubEmbedVideo,
    feedbackPoints:
      noProgress &&
      progress[0].feedbackPoints &&
      Array.isArray(progress[0].feedbackPoints) &&
      progress[0].feedbackPoints.length > 0
        ? progress[0].feedbackPoints
        : step[0].acceptanceCriteria
  }
  return {
    step: mergedStep
  }
}

async function findOneAndUpdateOrCreateStep(userId, stepUrl, stepId) {
  try {
    let step
    step = await ApplicantProgress.findOneAndUpdate(
      { userId, stepId },
      {
        status: 'Submitted',
        $addToSet: {
          urls: [{ ...stepUrl, createdAt: new Date() }]
        }
      }
    )
    if (!step) {
      step = await ApplicantProgress.create({
        userId,
        stepId,
        messages: [],
        status: 'Submitted',
        urls: [{ ...stepUrl, createdAt: new Date() }]
      })
    }
    const mergeStep = mergeApplicantProgressWithSteps(step)
    return mergeStep
  } catch (err) {
    throw new Error(err)
  }
}

export async function addURLToApplicantStep({ userId, stepUrl, stepId, user }) {
  try {
    const step = await findOneAndUpdateOrCreateStep(userId, stepUrl, stepId)
    await updateApplicantStepCache(step)
    const city = await getCityFromCache(user.cityId)
    if (city) {
      const urlSubmittedNotificationsData = {
        ...user,
        stepId,
        url: stepUrl.url
      }
      const lookupStep = await StepsContext.findOneBy({ _id: stepId })
      if (lookupStep.number === 4.1) {
        urlStep4SubmittedNotifications(urlSubmittedNotificationsData, city)
      } else {
        urlStepsSubmittedNotifications(urlSubmittedNotificationsData, city)
      }
    }
    return {
      city,
      step
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const getStudentsData = async applicant => {
  const allSteps = await StudentProgress.findBy({ userId: applicant.userId })
  if (allSteps && allSteps.length > 0) {
    const steps = await Promise.all(
      allSteps.map(step => mergeApplicantProgressWithSteps(step))
    )
    return {
      ...applicant,
      steps
    }
  }
  return {
    ...applicant,
    steps: []
  }
}

export const findApplicants = async cyfCityId => {
  try {
    const applicants = await StudentContext.findStudents(
      {
        category: STUDENT_CATEGORIES.applicant,
        cityId: {
          $in: cyfCityId
        }
      },
      {
        _id: 1,
        fullName: 1,
        dateOfBirth: 1,
        city: 1,
        userId: 1,
        gender: 1,
        email: 1,
        cityId: 1,
        isAsylumSeekerOrRefugee: 1,
        createdAt: 1,
        tel: 1,
        phoneCallStatus: 1,
        workshopsStatus: 1,
        updatedAt: 1,
        phoneCalls: 1,
        workshops: 1,
        experience: 1,
        currentlyEmployed: 1,
        applicationAccepted: 1,
        archived: 1,
        hearAbout: 1,
        country: 1
      }
    )
    return applicants
  } catch (err) {
    throw new Error(err)
  }
}

export async function getCityIdForUser(user) {
  if (user.cityId) {
    return user.cityId
  }
  const lookUpCity = await getCityFromCache(user.cityId)
  return lookUpCity._id
}

export async function getApplicantsByCityId(cyfCityId) {
  const cachedApplicantsData = await getDataFromCacheByQuery(cyfCityId)
  if (cachedApplicantsData) {
    return cachedApplicantsData
  }

  const applicants = await findApplicants(cyfCityId)
  const applicantData = await Promise.all(
    applicants.map(applicant => getStudentsData(applicant))
  )
  await setCacheDataByQuery(cyfCityId, applicantData, TWENTY_FOUR_HOURS)
  return applicantData
}

async function getApplicantsByCityIds(cyfCityIds) {
  if (Array.isArray(cyfCityIds)) {
    return await Promise.all(
      cyfCityIds.map(cityId => getApplicantsByCityId(cityId))
    )
  }
  return await getApplicantsByCityId(cyfCityIds)
}

//end of filtering functions

export async function getListOfApplicantsByQuery(query, user) {
  try {
    let searchFilters = { ...query }
    if (_.isEmpty(searchFilters) || _.isEmpty(searchFilters.cyfCityIds)) {
      searchFilters.cyfCityIds = await getCityIdForUser(user)
    }
    if (
      Array.isArray(searchFilters.cyfCityIds) &&
      searchFilters.cyfCityIds.length > 1 &&
      user.superAdmin === false
    ) {
      throw new Error('NOT_COOL_BRO')
    }
    let applicants = []
    applicants = await getApplicantsByCityIds(searchFilters.cyfCityIds)
    applicants = applicants.flat()
    return applicants
  } catch (err) {
    throw new Error(err)
  }
}

export const getAllApplicants = async () => {
  try {
    const applicants = await StudentContext.findAll({
      category: STUDENT_CATEGORIES.applicant
    })
    return applicants.map(applicant => applicant.toJSON())
  } catch (err) {
    return err
  }
}

export const getAdminByUserId = async _id => {
  try {
    return await UserContext.findById(
      { _id },
      {
        _id: 1,
        avatar_url: 1,
        firstName: 1,
        lastName: 1,
        dateOfBirth: 1,
        email: 1,
        cityId: 1,
        roles: 1,
        role: 1,
        city: 1,
        tel: 1,
        superAdmin: 1
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}

export const getAllApplicantsForCSV = async () => {
  try {
    const applicants = await getAllApplicants()
    return await Promise.all(
      applicants.map(applicant => getStudentsData(applicant))
    )
  } catch (err) {
    throw new Error(err)
  }
}

export const cacheAdmins = async () => {
  try {
    const admins = await UserContext.findAll({ admin: true })
    await setCacheDataByQuery('get:admins', admins, TWENTY_FOUR_HOURS)
    return admins
  } catch (err) {
    throw new Error(err)
  }
}

export const getListOfAdmins = async () => {
  try {
    const cachedVersion = await getDataFromCacheByQuery('get:admins')
    if (cachedVersion) {
      return {
        cached: true,
        admins: cachedVersion
      }
    }
    const admins = await cacheAdmins()
    return {
      admins,
      cached: false
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const removeStudent = async req => {
  const { userId } = req.params
  try {
    const applicant = await StudentContext.findOneStudent({ userId })
    const deletedApplicant = await StudentContext.hardDelete({
      userId
    })
    const deleteSteps = await StudentProgress.hardDelete({
      userId
    })
    //save action to logs
    const body = {
      applicant: {
        fullName: applicant.fullName,
        userId: applicant.userId,
        email: applicant.email
      }
    }
    const category = 'APPLICANT_DELETE'

    await logActions(body, req, category)
    await removeApplicantFromCache(userId, applicant.cityId)
    return {
      deleteSteps,
      deletedApplicant
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const recordStudentCallStatus = async (
  userId,
  callStatus,
  callMaker
) => {
  try {
    return StudentContext.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          phoneCalls: [
            {
              status: callStatus.status,
              comment: callStatus.comment,
              createdAt: new Date(),
              callMakerId: callMaker._id,
              callMakerName: callMaker.fullName
            }
          ]
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}

// undo call to student using the call Id
export const undoStudentCallStatus = async (userId, callId) => {
  try {
    return StudentContext.findOneAndUpdate(
      { userId },
      {
        $pull: {
          phoneCalls: { _id: callId }
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}

// edit a call to student
export const editStudentCallStatus = async (
  userId,
  callId,
  newComment,
  newStatus
) => {
  try {
    return StudentContext.findOneAndUpdate(
      { userId, 'phoneCalls._id': callId },
      {
        $set: {
          'phoneCalls.$.comment': newComment,
          'phoneCalls.$.status': newStatus
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}

export const recordStudentWorkshopsStatus = async (
  userId,
  workshopsStatus,
  submittedBy
) => {
  try {
    return StudentContext.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          workshops: [
            {
              status: workshopsStatus.status,
              comment: workshopsStatus.comment,
              createdAt: new Date(),
              IdsubmittedBy: submittedBy._id,
              NameSubmittedBy: submittedBy.fullName
            }
          ]
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}

// delete student workshop using the workshop Id
export const deleteStudentWorkshopsStatus = async (userId, workshopId) => {
  try {
    return StudentContext.findOneAndUpdate(
      { userId },
      {
        $pull: {
          workshops: { _id: workshopId }
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}

// edit a workshop
export const editStudentWorkshopsStatus = async (
  userId,
  workshopId,
  newComment,
  newStatus
) => {
  try {
    return StudentContext.findOneAndUpdate(
      { userId, 'workshops._id': workshopId },
      {
        $set: {
          'workshops.$.comment': newComment,
          'workshops.$.status': newStatus
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}
