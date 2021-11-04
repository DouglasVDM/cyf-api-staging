import mongoose from 'mongoose'

import StudentContext from '../../application_process/contexts/students'
import StepsContext from '../../application_process/contexts/steps'
import ApplicantProgress from '../../application_process/contexts/applicant_progress'
import dumpToSpreadsheet from '../../application_process/helpers/dumToStylesheet'
import {
  findApplicants,
  getStudentsData
} from '../../application_process/helpers/utils'

import CityContext from '../contexts/cities'
import AdminContext from '../contexts/admin'
import UserContext from '../contexts/user'
import { logError } from '../contexts/log'
import VolunteerContext from '../../volunteer/contexts/volunteer'
import ListContext from '../contexts/lists'

export const addStepsToApplicant = async (req, res) => {
  try {
    const ApplicantProgressSteps = await StepsContext.findAll()
    await ApplicantProgressSteps.forEach(async step => {
      if (step.stepNumber) {
        const actualStep = await StepsContext.findBy({
          number: step.stepNumber
        })
        if (actualStep.length > 0) {
          const urls = step.stepUrl.map(url => {
            const createdAt = url._id.getTimestamp()
            return { url: url.url, status: url.urlStatus, createdAt }
          })
          const messages = step.message.map(message => {
            const createdAt = message._id.getTimestamp()
            return {
              senderName: message.senderName,
              message: message.message,
              createdAt
            }
          })
          await ApplicantProgress.create({
            status: step.stepStatus,
            createdAt: step.createdAt,
            updatedAt: step.updatedAt,
            userId: step.userId,
            stepId: actualStep[0]._id,
            messages,
            urls
          })
          await StepsContext.hardDelete({ _id: step._id })
        }
      }
    })
    return res.status(200).send({
      msg: 'all applicants progress created.'
    })
  } catch (err) {
    return res.status(400).send({
      err,
      errors: err.message
    })
  }
}

async function setApplicantsCacheByCityId(cyfCityId) {
  const applicants = await findApplicants(cyfCityId)
  return Promise.all(applicants.map(applicant => getStudentsData(applicant)))
}

export const updateApplicants = async (req, res) => {
  try {
    const cities = await CityContext.findAll()
    const applicants = await Promise.all(
      cities.map(city => setApplicantsCacheByCityId(city._id))
    )
    const flatApplecarts = applicants.flat()
    await Promise.all(
      flatApplecarts.map(async applicant => {
        if (applicant.steps && applicant.steps.length > 0) {
          await Promise.all(
            applicant.steps.map(async step => {
              await ApplicantProgress.findOneAndUpdate(
                { userId: step.userId, stepId: step.stepId },
                { feedbackPoints: [] }
              )
            })
          )
        }
      })
    )
    return res.status(200).json({ done: 'done' })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const updateCities = async (req, res) => {
  try {
    const cities = await CityContext.findAll()
    await Promise.all(
      cities.map(async city => {
        const newCity = {
          slackChannel: city.slackChanel,
          slackChannelId: city.slackChanelId
        }
        await CityContext.findOneAndUpdate({ _id: city._id }, newCity)
      })
    )
    return res.status(200).json({})
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const updateAdmins = async (req, res) => {
  try {
    const admins = await AdminContext.findAll()
    await Promise.all(
      admins.map(async admin => {
        const newUser = {
          admin: true,
          adminStatus: 'VERIFIED',
          role: admin.cyfRole,
          city: admin.city,
          email: admin.email.toLowerCase(),
          tel: admin.tel,
          firstName: admin.fullName.split(' ')[0],
          lastName: admin.fullName.split(' ')[1]
        }
        await UserContext.findOneAndUpdate({ _id: admin.userId }, newUser)
      })
    )
    return res.status(200).json({})
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteDuplicateProgress = async (req, res) => {
  try {
    const applicantProgress = await ApplicantProgress.findAll()
    await Promise.all([
      applicantProgress.forEach(async progress => {
        if (progress.urls.length === 0 && progress.messages.length === 0) {
          await ApplicantProgress.hardDelete({ _id: progress._id })
        }
      })
    ])
    return res.status(200).json({ msg: 'done' })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const userEmailsToLowerCase = async (req, res) => {
  try {
    const users = await UserContext.findAll()
    Promise.all([
      users.forEach(async user => {
        if (user.email) {
          UserContext.findOneAndUpdate(
            { _id: user._id },
            { email: user.email.toLowerCase() }
          )
        }
      })
    ])
    return res.status(200).json({ msg: 'done' })
  } catch (err) {
    return res.status(500).json(err)
  }
}
export const studentsEmailsToLowerCase = async (req, res) => {
  try {
    const students = await StudentContext.findAll()
    Promise.all([
      students.forEach(async student => {
        if (student.email) {
          StudentContext.findOneAndUpdate(
            { _id: student._id },
            { email: student.email.toLowerCase() }
          )
        }
      })
    ])
    return res.status(200).json({ msg: 'done' })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteDuplicateUsers = async (req, res) => {
  try {
    const students = await StudentContext.findAll()
    Promise.all([
      students.forEach(async user => {
        if (user.email) {
          UserContext.findOneAndUpdate(
            { _id: user._id },
            { email: user.email.toLowerCase() }
          )
        }
      })
    ])
    return res.status(200).json({ msg: 'done' })
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const getApplicantsToSpreadSheet = async (req, res) => {
  try {
    const applicants = await findApplicants()
    const applicantData = await Promise.all(
      applicants.map(applicant => getStudentsData(applicant))
    )
    await dumpToSpreadsheet(applicantData)
    res.status(200).send({
      applicants: applicantData
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get Applicants.')
  }
}

export const updateVolunteers = async (req, res) => {
  try {
    const volunteers = await VolunteerContext.findAll()
    const lists = await ListContext.findAll()

    const updatedVolunteers = await Promise.all(
      volunteers.map(async (volunteer, index) => {
        let list
        if (volunteer) {
          list = lists.find(list => list.name === volunteer.volunteerStatus)
          if (!list) {
            list = lists.find(list => list.name === 'NEW')
          }
          const timeFromObjectId = mongoose.Types.ObjectId(
            volunteer._id
          ).getTimestamp()
          const newVolunteer = {
            listId: list._id,
            pos: new Date().getTime(timeFromObjectId) + index * 10
          }
          const updatedVolunteerData = await VolunteerContext.findOneAndUpdate(
            { _id: volunteer._id },
            newVolunteer
          )
          return updatedVolunteerData
        }
      })
    )
    res.status(200).send({
      volunteers: updatedVolunteers
    })
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not update.')
  }
}
