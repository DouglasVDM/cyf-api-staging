import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'

import { classStatus } from './controllers'

const router = express.Router()
router.use(
  jwt({
    secret: config.jwtSecret
  }).unless({
    path: ['/statistics/class-status']
  })
)

router.get('/class-status', classStatus)

export default router
