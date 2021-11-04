import cors from 'cors'
import url from 'url'
import morgan from 'morgan'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import config from '../config'
import UserContext from '../apps/common/contexts/user'

export async function ignoreFavIcon(req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    return res.sendStatus(204)
  }
  next()
  return null
}

export function flattenArray(array) {
  const flattenedArray = [].concat(...array)
  return flattenedArray.some(Array.isArray)
    ? flattenArray(flattenedArray)
    : flattenedArray
}

const getPatternsForURLs = env => {
  switch (env) {
    case 'DEVELOPMENT':
      return /^localhost$/
    case 'STAGING':
      return /^(?:(?:[^.]+\.)?staging|staging\.forms)\.codeyourfuture\.io$/
    default:
      return /^(?!\.)([^s]|s(?!taging.))*codeyourfuture\.io$/
  }
}
export const validOriginFor = env => {
  return async (origin, cb) => {
    if (!origin) {
      /*
        Return fmt: error, options
        Deny by default:
        return cb(new Error('DIRECT_ACCESS_NOT_ALLOWED'), false)
      */
      return cb(null, true)
    }

    const originalUrl = url.parse(origin)
    const urlPattern = getPatternsForURLs(env)
    const valid = urlPattern.test(originalUrl.hostname)

    if (valid === false) {
      // eslint-disable-next-line no-console
      console.error('API_CONNECTION_DENIED', {
        originalUrl
      })
    }

    return cb(null, !!valid)
  }
}

export const cyfCORS = cors({
  origin: validOriginFor(config.env),
  credentials: true
})

export const morganLogger = () =>
  morgan((tokens, req, res) => {
    return [
      dayjs()
        .locale('en')
        .format('YYYY-MM-DD HH:mm:ss'),
      '-',
      `${req.headers.application ? req.headers.application : 'API'} (${
        config.env
      })`,
      '-',
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      res.cached ? '(cached)' : ''
    ].join(' ')
  })

export async function authHelper(req, res, next) {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const tokenUser = jwt.verify(token, process.env.JWT_SECRET)

      let userLookUp
      userLookUp = await UserContext.findById({ _id: tokenUser._id })
      if (!userLookUp) {
        // TODO: improve
        userLookUp = await UserContext.findById({ _id: tokenUser.userId })
      }
      if (!userLookUp) {
        // eslint-disable-next-line no-console
        console.error('TOKEN_USER_MISMATCH', { tokenUser })
        return res.sendStatus(401)
      }
      // eslint-disable-next-line require-atomic-updates
      req.user = {
        ...userLookUp,
        _id: userLookUp._id.toJSON ? userLookUp._id.toJSON() : userLookUp._id
      }
      if (userLookUp.admin && userLookUp.adminStatus === 'VERIFIED') {
        // eslint-disable-next-line require-atomic-updates
        req.admin = true
      }
      if (
        userLookUp.admin &&
        userLookUp.adminStatus === 'VERIFIED' &&
        userLookUp.superAdmin
      ) {
        // eslint-disable-next-line require-atomic-updates
        req.superAdmin = true
      }
    }
    next()
  } catch (err) {
    res.sendStatus(401)
  }
}

export const adminOnly = (req, res, next) => {
  if (!req.admin) {
    // TODO should probably be 403
    return res.sendStatus(401)
  }
  next()
}

export const superAdminOnly = (req, res, next) => {
  if (!req.superAdmin) {
    return res.sendStatus(403)
  }
  next()
}

export const toLowerCaseIfAlpha = value => {
  return typeof value === 'string' ? value.toLowerCase() : value
}
export const pancakeSort = (propertyName, ascending) => {
  return (a, b) => {
    if (
      toLowerCaseIfAlpha(a[propertyName]) < toLowerCaseIfAlpha(b[propertyName])
    ) {
      return ascending ? -1 : 0
    }
    return ascending ? 0 : -1
  }
}
