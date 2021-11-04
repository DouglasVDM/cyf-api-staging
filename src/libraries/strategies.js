import { Strategy as GitHubStrategy } from 'passport-github2'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import StudentContext from '../apps/application_process/contexts/students'
import UserContext from '../apps/common/contexts/user'
import config from '../config'

const callbackURL = {
  googleApplicantStrategy: `${config.appUrl}/auth/callback/application/google/applicant`,
  githubApplicantStrategy: `${config.appUrl}/auth/callback/application/github/applicant`,
  githubStudentStrategy: `${config.appUrl}/auth/callback/application/github/student`,
  githubDashboardStrategy: `${config.appUrl}/auth/callback/application/github/admin`,
  githubEventsStrategy: `${config.appUrl}/auth/callback/events/github`
}

// github Admin Strategy
export const githubDashboardStrategy = new GitHubStrategy(
  {
    ...config.github,
    scope: ['user:email'],
    callbackURL: callbackURL.githubDashboardStrategy
  },
  async (accessToken, refreshToken, profile, cb) => {
    const userDetails = {
      githubId: profile.id,
      firstName: profile.displayName,
      githubURL: profile._json.url,
      email:
        profile.emails &&
        profile.emails[0] &&
        profile.emails[0].value.toLowerCase(),
      avatarURL: profile._json.avatar_url,
      accessToken,
      refreshToken,
      admin: true
    }
    const user = await UserContext.findOrCreateAdminUser(userDetails)
    cb(null, user)
  }
)

// google applicant strategy
export const googleApplicantStrategy = new GoogleStrategy(
  {
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: callbackURL.googleApplicantStrategy
  },
  async (accessToken, refreshToken, profile, cb) => {
    const userDetails = {
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      gender: profile.gender,
      accessToken,
      refreshToken,
      email:
        profile.emails &&
        profile.emails[0] &&
        profile.emails[0].value.toLowerCase()
    }
    const user = await UserContext.findOrCreateUserForStudent(userDetails)
    const student = await StudentContext.findOneStudent({
      userId: user._id
    })
    if (student) {
      user.studentId = student._id.toJSON()
      user.userId = user._id.toJSON()
    }
    cb(null, user)
  }
)

// github volunteers Strategy
export const githubEventsStrategy = new GitHubStrategy(
  {
    ...config.github,
    scope: ['user:email'],
    callbackURL: callbackURL.githubEventsStrategy
  },
  async (accessToken, refreshToken, profile, cb) => {
    const userDetails = {
      githubId: profile.id,
      firstName: profile.displayName,
      githubURL: profile._json.url,
      email:
        profile.emails &&
        profile.emails[0] &&
        profile.emails[0].value.toLowerCase(),
      avatarURL: profile._json.avatar_url,
      accessToken,
      refreshToken
    }
    const user = await UserContext.findOrCreateUserForVolunteer(userDetails)
    cb(null, user)
  }
)

// github Applicant Strategy
export const githubApplicantStrategy = new GitHubStrategy(
  {
    ...config.github,
    scope: ['user:email'],
    callbackURL: callbackURL.githubApplicantStrategy
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const userDetails = {
        githubId: profile.id,
        firstName: profile.displayName,
        githubURL: profile._json.url,
        email:
          profile.emails &&
          profile.emails[0] &&
          profile.emails[0].value.toLowerCase(),
        avatarURL: profile._json.avatar_url,
        accessToken,
        refreshToken
      }
      const user = await UserContext.findOrCreateUserForStudent(userDetails)
      const student = await StudentContext.findOneStudent({
        userId: user._id
      })
      if (student) {
        user.studentId = student._id.toJSON()
        user.userId = user._id.toJSON()
      }
      cb(null, user)
    } catch (err) {
      cb(err, null)
    }
  }
)

// github student Strategy
export const githubStudentStrategy = new GitHubStrategy(
  {
    ...config.github,
    scope: ['user:email'],
    callbackURL: callbackURL.githubStudentStrategy
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const userDetails = {
        githubId: profile.id,
        firstName: profile.displayName,
        githubURL: profile._json.url,
        email:
          profile.emails &&
          profile.emails[0] &&
          profile.emails[0].value.toLowerCase(),
        avatarURL: profile._json.avatar_url,
        accessToken,
        refreshToken
      }
      const user = await UserContext.findOrCreateUserForStudent(userDetails)
      user.userId = user._id.toJSON()
      cb(null, user)
    } catch (err) {
      cb(err, null)
    }
  }
)
