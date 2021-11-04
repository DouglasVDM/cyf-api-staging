import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'
import {
  applicantRegistration,
  getApplicantById,
  editApplicant,
  login,
  loginWithMagicLink,
  updateApplicant
} from './controllers/applicant'
import { createUserForStudent, editUser } from './controllers/user'

import {
  createAdmin,
  getSingleAdmin,
  getAdmins,
  removeApplicant,
  getListOfApplicants,
  setCallStatus,
  removeCallToStudent,
  editCallToStudent,
  setWorkshopsStatus,
  removeWorkshopsStatus,
  updateWorkshopsStatus,
  createFeedbackPoint,
  editFeedbackPoint
} from './controllers/admin'

import { createMessage, editMessage } from './controllers/messenger'

import {
  insertUrlToStep,
  getStep,
  updateUrl,
  createStep,
  getSteps,
  editStep,
  editApplicantProgress,
  deleteImageFromApplicantProgress
} from './controllers/steps'

import upload from '../helpers/imageUpload'
import imageUpload from './controllers/image'
import { adminOnly, superAdminOnly } from '../../helpers'

const router = express.Router()
router.use(
  jwt({
    secret: config.jwtSecret
  }).unless({
    path: [
      '/application-process/login',
      '/application-process/applicant', // TODO: should only permit POST without JWT
      '/application-process/admin', // for register
      '/application-process/register', // TODO: change this to /register and move out of this file
      /\/application-process\/magic-link\/(.*)/
    ]
  })
)

// applicant
router.post('/applicant', applicantRegistration)
router.get('/applicant/:id', adminOnly, getApplicantById)
router.get('/applicant', getApplicantById)
router.put('/applicant', editApplicant)
router.put('/applicant/:userId', adminOnly, updateApplicant)
router.post('/login', login)
router.get('/magic-link/:token?', loginWithMagicLink)

// admin
router.put('/admin', createAdmin)
router.get('/admin', adminOnly, getSingleAdmin)
router.get('/applicants', adminOnly, getListOfApplicants)
router.get('/admins', superAdminOnly, getAdmins)
router.delete('/applicant/:userId?', superAdminOnly, removeApplicant)

router.post('/applicant/:userId/phonecalls', setCallStatus)
router.delete('/applicant/:userId/phonecalls', removeCallToStudent)
router.put('/applicant/:userId/phonecalls', editCallToStudent)

router.post('/applicant/:userId/workShops', setWorkshopsStatus)
router.delete('/applicant/:userId/workShops', removeWorkshopsStatus)
router.put('/applicant/:userId/workShops', updateWorkshopsStatus)

// messenger
router.post('/message', createMessage)
router.put('/message', editMessage)

// steps
router.get('/step/:id?', getStep)
router.post('/step/url', insertUrlToStep)
router.put('/step/url', updateUrl)
router.put('/step/progress', editApplicantProgress)
router.put('/step/progress/image', deleteImageFromApplicantProgress)

// user
router.post('/register', createUserForStudent)
router.put('/user', adminOnly, editUser)

// cards
router.post('/step', createStep)
router.get('/steps', getSteps)
router.put('/step', editStep)
router.post('/image', upload.single('image'), imageUpload)

//feedback points
router.post('/feedback-point', createFeedbackPoint)
router.put('/feedback-point', editFeedbackPoint)

export default router
