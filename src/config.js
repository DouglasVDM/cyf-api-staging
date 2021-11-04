import * as dotenv from 'dotenv'
import aws from 'aws-sdk'

dotenv.config()

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  dashboardClientUrl: process.env.DASHBOARD_CLIENT_URL,
  applicationProcessClientUrl: process.env.APPLICATION_PROCESS_CLIENT_URL,
  studentClientUrl: process.env.STUDENT_CLIENT_URL,
  adminDashboardURL: process.env.ADMIN_DASHBOARD_URL,
  eventsClientUrl: process.env.EVENTS_CLIENT_URL,
  volunteerClientUrl: process.env.VOLUNTEER_CLIENT_URL,
  slackToken: process.env.SLACK_TOKEN,
  catchOnAllEmail: process.env.CATCH_ON_ALL_EMAIL,
  jwtSecret: process.env.JWT_SECRET,
  clientEmailForSpreadsheet: process.env.CLIENT_EMAIL_FOR_SPREADSHEET,
  privateKeyForSpreaddsheet: process.env.PRIVATE_KEY_FOR_SPREADSHEET,
  appEmail: process.env.APP_EMAIL,
  cache: {
    connection: process.env.REDIS_CONNECTION,
    test: 'redis://:password@127.0.0.1:6379/1'
  },
  db: {
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    connection: process.env.DB_CONNECTION_STRING,
    testdb: 'mongodb://localhost:27017/CYFTestDB'
  },
  github: {
    authorizationURL: process.env.GITHUB_AUTH_URL,
    tokenURL: process.env.GITHUB_TOKEN_URL,
    userProfileURL: process.env.GITHUB_PROFILE_URL,
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },
  aws: {
    config: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION
    },
    bucket: process.env.ASSETS_BUCKET
  },
  debug: process.env.DEBUG ? process.env.DEBUG : 'none',
  emails: {
    events: 'events@codeyourfuture.io',
    expenses: 'expenses@codeyourfuture.io'
  },
  sentry: {
    dsn: 'https://702976cce4704469b3d9e559923046ac@sentry.codeyourfuture.io/2'
  }
}

const DontLogInProd = config.env.toUpperCase() !== 'PRODUCTION'
const DontLogInTests = config.env.toUpperCase() !== 'TEST'
const DontLogInCI = config.env.toUpperCase() !== 'CI'

if (DontLogInProd && DontLogInTests && DontLogInCI) {
  // eslint-disable-next-line no-console
  console.log({ config })
}

const SNS_API_VERSION = '2010-03-31'
const SES_API_VERSION = '2010-12-01'

const s3 = new aws.S3(config.aws.config)
const ses = new aws.SES({ ...config.aws.config, apiVersion: SES_API_VERSION })
const sns = new aws.SNS({ ...config.aws.config, apiVersion: SNS_API_VERSION })

export const SMS_TYPE = {
  TRANSACTIONAL: 'Transactional' /* highest reliability */,
  PROMOTIONAL: 'Promotional' /* lowest cost */
}

export { s3, ses, sns }
export default config
