// eslint-disable-next-line
import LogsService from './service'
import config from '../../../../config'
const logsService = new LogsService()

export const log = (body, req) =>
  logsService.create({
    category: 'event',
    event: {
      method: req.method,
      url: req.url
    },
    message: body.message,
    body,
    app: req.headers.application,
    client: req.hostname
  })

export const logActions = (body, req, category) => {
  const event = {
    userId: req.user._id,
    category,
    event: { method: req.method, url: req.url },
    app: req.headers.application,
    body,
    client: req.hostname
  }
  logsService.create(event)
}

export const logError = (err, req) => {
  const error = {
    category: 'error',
    event: {
      error: err.message,
      method: req.method,
      stack: err.stack,
      url: req.url
    },
    app: req.headers.application,
    client: req.hostname
  }
  // eslint-disable-next-line no-console
  console.error({ err: error })
  return logsService.create(error)
}
export const logSimple = message => {
  if (config && config.debug !== 'none') {
    // eslint-disable-next-line no-console
    console.log(message)
  }
}

export const logErrorSimple = (err, message) => {
  const error = {
    category: 'error',
    event: {
      error: err
    },
    message,
    app: null,
    client: null
  }
  // eslint-disable-next-line no-console
  console.error(err)
  return logsService.create(error)
}
