import passport from 'passport'
import {
  githubDashboardStrategy,
  githubApplicantStrategy,
  githubEventsStrategy,
  githubStudentStrategy,
  googleApplicantStrategy
} from './strategies'

passport.use('applicationApplicantStrategy', githubApplicantStrategy)
passport.use('applicationGoogleApplicantStrategy', googleApplicantStrategy)
passport.use('dashboardGithubStrategy', githubDashboardStrategy)
passport.use('githubEventsStrategy', githubEventsStrategy)
passport.use('githubStudentStrategy', githubStudentStrategy)
