import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'

import {
  getEvent,
  getEvents,
  createEvent,
  putEvent,
  deleteEvent,
  addVolunteerToEvent,
  removeEventVolunteer,
  registration
} from './controllers/events'

import { getCities } from '../common/controllers/city'
import { getSingleAdmin } from '../application_process/controllers/admin'
import { editUser } from '../application_process/controllers/user'
import { adminOnly } from '../../helpers'

const router = express.Router()
router.use(
  jwt({
    secret: config.jwtSecret
  }).unless({
    path: ['/', '/events', '/event', /\/events\/(.*)/]
  })
)
router.get('/cities', getCities)
router.post('/register', registration)
router.get('/user/:_id', adminOnly, getSingleAdmin)
router.put('/user', editUser)

router.get('/:eventId?', getEvent)
router.get('/city/:city?', getEvents)

router.post('/', createEvent)

router.delete('/:eventId', deleteEvent)
router.put('/:eventId', putEvent)
router.put('/:eventId/addVolunteer', addVolunteerToEvent)
router.put('/:eventId/removeVolunteer', removeEventVolunteer)

export default router
