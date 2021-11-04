import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'

import {
  createVolunteer,
  getVolunteers,
  updateVolunteer,
  deleteVolunteer,
  reorderVolunteer,
  archiveVolunteer,
  volunteerComment,
  verifyVolunteer,
  updateVolunteerByMagicLink
} from './controllers/volunteer'
import { adminOnly } from '../../helpers'

const router = express.Router()

router.use(
  jwt({
    secret: config.jwtSecret
  }).unless({
    path: [
      { url: '/volunteer', methods: ['POST'] },
      '/volunteer/email/verification',
      /\/volunteer\/magic-link\/(.*)/
    ]
  })
)

router.post('/', createVolunteer)
router.post('/comment/:id', volunteerComment)
router.put('/:userId', adminOnly, updateVolunteer)
router.put('/reorder/:id', reorderVolunteer)
router.put('/archive/:id', archiveVolunteer)
router.delete('/:userId', deleteVolunteer)
router.get('/', adminOnly, getVolunteers)
router.post('/email/verification', verifyVolunteer)
router.get('/magic-link/:token?', updateVolunteerByMagicLink)

export default router
