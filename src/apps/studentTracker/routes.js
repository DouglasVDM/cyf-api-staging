import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'

import { createStudentsTarget, getStudentsTargets } from './controllers/targets'
import { getAllCallsAndMessages } from './controllers/messagesAndCalls'

const router = express.Router()

router.use(
  jwt({
    secret: config.jwtSecret
  }).unless({
    path: ['/student/tracker']
  })
)

router.post('/target', createStudentsTarget)
router.get('/target', getStudentsTargets)
router.get('/communications', getAllCallsAndMessages)

export default router
