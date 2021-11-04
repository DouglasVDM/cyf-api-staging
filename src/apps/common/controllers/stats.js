import { logError } from '../contexts/log'
import { getListOfApplicantsByQuery } from '../../application_process/helpers/utils'
import {
  filterApplicantsByQuery,
  getStatsFromStudentGroup
} from '../../application_process/helpers/filters'
import {
  getApplicantCountLondon,
  getApplicantCountManchester
} from '../../statistics/useCases/statsGenerator'
import dayjs from 'dayjs'

const checkStep1Step2Approved = steps => {
  const isAfter = dayjs('2019-09-01').format('YYYY-MM-DD')
  const findApprovalSteps = steps.find(step => {
    if (step.number === 1 || step.number === 2) {
      if (
        dayjs(step.updatedAt).isAfter(isAfter) &&
        step.urls &&
        step.urls.length > 0
      ) {
        const approvedStep = step.urls.find(url => url.status === 'Approved')
        if (approvedStep) {
          return true
        }
      }
    }
  })
  if (findApprovalSteps) {
    return true
  }
}

const filterApprovedFromStepOneOrTwo = applicants => {
  return applicants.filter(applicant => {
    if (applicant.steps && applicant.steps.length > 0) {
      return checkStep1Step2Approved(applicant.steps)
    }
  })
}

export const getStats = async (req, res) => {
  try {
    const applicants = await getListOfApplicantsByQuery(req.query, req.user)

    const approvedFromStepOneOrTwo = filterApprovedFromStepOneOrTwo(applicants)

    const linkSubmitted = await filterApplicantsByQuery(
      {
        actions: ['Submitted']
      },
      applicants
    )
    const neededPhonCall = await filterApplicantsByQuery(
      {
        phoneCall: ['PENDING', 'noPhoneCall', 'FAIL']
      },
      applicants
    )
    const newMessages = await filterApplicantsByQuery(
      {
        messages: ['NEW']
      },
      applicants
    )
    const toDate = new Date()
    const fromDate = dayjs(toDate)
      .subtract(7, 'day')
      .toDate()
    const getNumberOfApplicantsPast7 = await filterApplicantsByQuery(
      {
        applicantsByDate: [fromDate, toDate]
      },
      applicants
    )

    const allStats = {
      cityId:
        req.query && req.query.cyfCityIds
          ? req.query.cyfCityIds[0]
          : req.user.cityId,
      linkSubmitted:
        linkSubmitted && linkSubmitted.length > 0 ? linkSubmitted.length : 0,
      neededPhonCall:
        neededPhonCall && neededPhonCall.length > 0 ? neededPhonCall.length : 0,
      newMessages:
        newMessages && newMessages.length > 0 ? newMessages.length : 0,
      getNumberOfApplicantsPast7:
        getNumberOfApplicantsPast7 && getNumberOfApplicantsPast7.length > 0
          ? getNumberOfApplicantsPast7.length
          : 0,
      total: applicants.length,
      applicants: {
        london: getStatsFromStudentGroup(applicants)
      },
      approvedFromStepOneOrTwoCount: approvedFromStepOneOrTwo.length,
      incoStats: {
        london: await getApplicantCountLondon(),
        manchester: await getApplicantCountManchester()
      }
    }

    return res.status(200).send({
      stats: allStats
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get stats')
  }
}

export const getActionStats = async (req, res) => {
  try {
    const applicants = await getListOfApplicantsByQuery(req.query, req.user)
    const actionsResults = await filterApplicantsByQuery(req.query, applicants)

    const actions = {
      all: actionsResults
    }
    return res.status(200).send({
      actions
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not show data')
  }
}

export const none = () => {}
