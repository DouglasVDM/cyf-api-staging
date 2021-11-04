import passport from 'passport'
import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import * as Sentry from '@sentry/node'

import config from './config'
import connectToDb from './db'
import { authHelper, cyfCORS, ignoreFavIcon, morganLogger } from './helpers'
import auth from './auth'
import * as apps from './apps'
import './libraries/passport'
import { logSimple } from './apps/common/contexts/log'
import swagger from './swagger/config'

Sentry.init({ dsn: config.sentry.dsn, environment: config.env })
export let server

export async function startAPI() {
  const app = express()
    .use(Sentry.Handlers.requestHandler())
    .get('/', (_, res) => res.sendStatus(200))
    .use(cyfCORS)
    .use(express.json({ limit: '50mb', parameterLimit: 50000 }))
    .use(compression())
    .use(morganLogger())
    .use(ignoreFavIcon)
    .use(passport.initialize())
    .use(authHelper)
    .use(helmet())
    .set('x-powered-by', false)
    .set('etag', false)
    .get('/crash', () => {
      throw new Error('Broke!')
    })
    .use('/auth', auth)
    .use('/application-process', apps.applicationProcess)
    .use('/events', apps.events)
    .use('/volunteer', apps.volunteer)
    .use('/students', apps.expenses)
    .use('/students/tracker', apps.studentTracker)
    .use('/teams', apps.teams)
    .use('/statistics', apps.statistics)
    .use('/docs', swagger)
    .use('/', apps.common)
    .use(
      Sentry.Handlers.errorHandler(error => {
        logSimple(`Reporting error to sentry ${JSON.stringify(error.status)}`)
        return true
      })
    )

  server = app.listen(3001 || config.port, () =>
    logSimple(`Listening on ${server.address().port}`)
  )
  logSimple('Connecting to DB..')
  await connectToDb()
  return app
}
startAPI()
