import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'
//Upload image to s3
import upload from '../helpers/imageUpload'
import fileUpload from '../helpers/fileUpload'
import { deleteApp, getApps, saveApp } from './controllers/apps'
import { createCity, editCity, getCities } from './controllers/city'
import {
  createClass,
  deleteClass,
  editClass,
  getClass
} from './controllers/classes'
import {
  createEmailHandler,
  deleteEmailHandler,
  editEmailHandler,
  getEmailsHandler
} from './controllers/email'
import { imageUpload } from './controllers/image'
import {
  addStepsToApplicant,
  deleteDuplicateProgress,
  deleteDuplicateUsers,
  getApplicantsToSpreadSheet,
  studentsEmailsToLowerCase,
  updateAdmins,
  updateApplicants,
  updateCities,
  userEmailsToLowerCase,
  updateVolunteers
} from './controllers/migrations'
import { getActionStats, getStats } from './controllers/stats'
import {
  createUserHandler,
  getUserHandler,
  editUserHandler,
  updateAdminRoles,
  deleteAdmin
} from './controllers/user'
import { sendEmail, _sendSMS } from './controllers/notification'
import { createList, getLists, editList, deleteList } from './controllers/lists'
import { adminOnly, superAdminOnly } from '../../helpers'
const router = express.Router()
router.use(
  jwt({
    secret: config.jwtSecret
  }).unless({
    path: ['/cities', '/stats', '/register', '/crash']
  })
)

router.post('/migrations/steps', addStepsToApplicant)
router.get('/migrations/students', updateApplicants)
router.get('/migrations/cities', superAdminOnly, updateCities)
router.get('/migrations/admins', superAdminOnly, updateAdmins)
router.get(
  '/migrations/delete-duplicate-progress',
  superAdminOnly,
  deleteDuplicateProgress
)
router.get('/migrations/user-email-to-lower-case', userEmailsToLowerCase)
router.get(
  '/migrations/delete-duplicate-users',
  superAdminOnly,
  deleteDuplicateUsers
)
router.get('/migrations/update-volunteers', updateVolunteers)
router.get(
  '/migrations/students-email-to-lower-case',
  studentsEmailsToLowerCase
)
router.get(
  '/migrations/applicants-to-spreadsheet',
  superAdminOnly,
  getApplicantsToSpreadSheet
)
// user
router.post('/register', createUserHandler)

//classes
router.post('/classes', createClass)
router.get('/classes', getClass)
router.put('/classes', editClass)
router.delete('/classes', deleteClass)

// city
router.post('/city', createCity)
router.get('/cities', getCities)
router.put('/city', editCity)

// stats
router.get('/stats', getStats)
router.get('/actions', getActionStats)

// apps
router.get('/apps', getApps)
router.post('/apps', saveApp)
router.delete('/apps/:appId?', superAdminOnly, deleteApp)

//image upload route
router.post('/image', upload.single('image'), imageUpload)

//expenses receipt upload route
router.post('/receipt', fileUpload.single('file'), imageUpload)

//email
router.post('/teams/emails', createEmailHandler)
router.put('/teams/emails/:emailId?', editEmailHandler)
router.delete('/teams/emails/:emailId?', deleteEmailHandler)
router.get('/teams/emails', getEmailsHandler)

router.post('/email/send', sendEmail)
router.post('/sms/send', _sendSMS)
//user
router.get('/user', getUserHandler)
router.put('/user', adminOnly, editUserHandler)
router.put('/admin/roles/:id', superAdminOnly, updateAdminRoles)
router.delete('/admin/:id', superAdminOnly, deleteAdmin)
//classes
router.post('/lists', createList)
router.get('/lists', getLists)
router.put('/lists/:id', editList)
router.delete('/lists/:id', deleteList)

export default router
