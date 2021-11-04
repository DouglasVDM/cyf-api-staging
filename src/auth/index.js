import { Router } from 'express'
import passport from 'passport'
import JwtTokenCreator from '../apps/helpers/jwtTokenCreator'
import config from '../config'
import { ADMIN_STATUS } from '../apps/common/contexts/user/schema'
import VolunteerContext from '../apps/volunteer/contexts/volunteer'
import { addNewAdminToCache } from '../useCases/CacheUtils'
const router = Router()

// applicant registration
router.get(
  '/github-applicant',
  passport.authenticate('applicationApplicantStrategy')
)
router.get(
  '/callback/application/github/applicant',
  passport.authenticate('applicationApplicantStrategy', {
    failureRedirect: '/register',
    session: false
  }),
  async (req, res) => {
    if (!req.user) {
      return res.sendStatus(500)
    }
    if (req.user.studentId) {
      const token = await JwtTokenCreator(req.user)
      return res.redirect(
        `${config.applicationProcessClientUrl}/log-in/${token}`
      )
    }
    if (req.user && req.user._id) {
      return res.redirect(
        `${config.applicationProcessClientUrl}/application-form/${req.user._id}`
      )
    }
  }
)

//refresh user token
router.post('/token', async (req, res) => {
  try {
    const token = await JwtTokenCreator(req.user)
    return res.status(200).send({
      token
    })
  } catch (err) {
    return res.status(403)
  }
})

// google log in
router.get(
  '/google-applicant',
  passport.authenticate('applicationGoogleApplicantStrategy', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  })
)
router.get(
  '/callback/application/google/applicant',
  passport.authenticate('applicationGoogleApplicantStrategy', {
    failureRedirect: '/register',
    session: false
  }),
  async (req, res) => {
    if (req.user.userId) {
      const token = await JwtTokenCreator(req.user)
      return res.redirect(
        `${config.applicationProcessClientUrl}/log-in/${token}`
      )
    }
    const { _id } = req.user
    return res.redirect(
      `${config.applicationProcessClientUrl}/application-form/${_id}`
    )
  }
)
// admin registration
router.get('/github-admin', passport.authenticate('dashboardGithubStrategy'))
router.get(
  '/callback/application/github/admin',
  passport.authenticate('dashboardGithubStrategy', {
    failureRedirect: '/admin/login',
    session: false
  }),
  async (req, res) => {
    const { _id, newAdmin } = req.user
    if (newAdmin) {
      addNewAdminToCache(req.user)
    }
    const volunteer = await VolunteerContext.findOneBy({ userId: _id })
    if (volunteer && volunteer._id) {
      if (req.user.adminStatus === ADMIN_STATUS.verified) {
        // this is an admin all good
        const token = await JwtTokenCreator(req.user)
        return res.redirect(`${config.dashboardClientUrl}/log-in/${token}`)
      }
      if (req.user.adminStatus === 'PENDING') {
        // this is an admin but is pending approval.
        return res.redirect(
          `${config.dashboardClientUrl}/log-in/${ADMIN_STATUS.pending}`
        )
      }
      if (req.user.adminStatus === 'SUSPENDED') {
        // this is an admin but is pending approval.
        return res.redirect(
          `${config.dashboardClientUrl}/log-in/${ADMIN_STATUS.suspended}`
        )
      }
    }
    return res.redirect(
      `${config.volunteerClientUrl}/code/${_id}?${config.dashboardClientUrl}`
    )
  }
)

// volunteer registration
router.get('/github-events', passport.authenticate('githubEventsStrategy'))
router.get(
  '/callback/events/github',
  passport.authenticate('githubEventsStrategy', {
    failureRedirect: '/register',
    session: false
  }),
  async (req, res) => {
    const token = await JwtTokenCreator(req.user)
    return res.redirect(`${config.eventsClientUrl}/log-in/${token}`)
  }
)

// github log in
router.get('/github-student', passport.authenticate('githubStudentStrategy'))
router.get(
  '/callback/application/github/student',
  passport.authenticate('githubStudentStrategy', {
    failureRedirect: '/login',
    session: false
  }),
  async (req, res) => {
    let token
    if (req.user) {
      if (req.user.roles.includes('STUDENT')) {
        token = await JwtTokenCreator(req.user)
        return res.redirect(`${config.studentClientUrl}/log-in/${token}`)
      } else {
        const NOT_STUDENT = 'NOT_STUDENT'
        return res.redirect(`${config.studentClientUrl}/log-in/${NOT_STUDENT}`)
      }
    }
    return res.redirect(`${config.studentClientUrl}/login`)
  }
)

export default router
