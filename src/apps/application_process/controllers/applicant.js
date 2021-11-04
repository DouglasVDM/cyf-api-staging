import StudentContext from '../contexts/students'
import UserContext from '../../common/contexts/user'
import config from '../../../config'
import mailer from '../../helpers/mailer'
import JwtTokenCreator from '../../helpers/jwtTokenCreator'
import { logError } from '../../common/contexts/log'
import {
  createApplicant,
  showApplicantByUserId,
  loginWithMagicLinkHelper
} from '../helpers/utils'
import {
  changeApplicantCityInCache,
  updateApplicantCache
} from '../helpers/updateRedis'
import { getCityFromCache } from '../../../useCases/CacheUtils'
export async function getApplicantById(req, res) {
  try {
    const userId = req.params.id ? req.params.id : req.user._id
    if (!userId) {
      return res.sendStatus(400)
    }
    const result = await showApplicantByUserId(userId)

    return res.status(200).send({
      applicant: result,
      steps: result.steps
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not show student')
  }
}

export async function applicantRegistration(req, res) {
  const {
    userId,
    firstName,
    lastName,
    dateOfBirth,
    city,
    tel,
    isAsylumSeekerOrRefugee,
    country,
    experience,
    itAccess,
    hearAbout,
    isEighteen,
    disadvantagedBackground,
    disadvantagedBackgroundDescribe,
    currentlyEmployed,
    studying,
    availableOnWhatsApp,
    cityId,
    gender,
    agreeToTOU,
    agreeToReceiveCommunication
  } = req.body
  const applicantDetails = {
    userId,
    fullName: `${firstName} ${lastName}`,
    dateOfBirth: new Date(dateOfBirth),
    city,
    tel,
    isAsylumSeekerOrRefugee,
    country,
    experience,
    itAccess,
    hearAbout,
    isEighteen,
    disadvantagedBackground,
    disadvantagedBackgroundDescribe,
    currentlyEmployed,
    studying,
    availableOnWhatsApp,
    cityId,
    category: 'applicant',
    gender,
    agreeToTOU,
    agreeToReceiveCommunication
  }
  try {
    const token = await createApplicant(applicantDetails)
    return res.status(200).send({
      token
    })
  } catch (err) {
    await logError(err, req)
    if (err.name === 'ValidationError') {
      return res
        .status(400)
        .send({ name: 'ValidationError', fields: err.errors })
    }
    if (err.message === 'EMAIL_USED') {
      return res.status(422).send('Email address already in used')
    }
    return res.status(400).send('Could not create student.')
  }
}

export const editApplicant = async (req, res) => {
  const { payload, userId, applicantCityId } = req.body
  if (!payload || !payload.cityId || !userId || !applicantCityId) {
    return res.status(400).send('Bad Request')
  }
  try {
    const applicant = await StudentContext.findOneAndUpdate(
      { userId },
      { ...payload }
    )
    const applicants = await changeApplicantCityInCache(
      applicant,
      applicantCityId
    )
    return res.status(200).send({
      applicants
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not edit Applicant.')
  }
}

export const login = async (req, res) => {
  const email = req.body.email.toLowerCase()

  if (email === '') {
    return res.status(400).send({
      success: false,
      err: 'Email cannot be empty.'
    })
  }
  try {
    const applicant = await StudentContext.showEmail({ email })

    if (applicant) {
      const token = await JwtTokenCreator(
        { fullName: applicant.fullName, email: applicant.email },
        '10m'
      )
      await UserContext.findOneAndUpdate({ email }, { token })
      const loginEmail = `
      <div>
      <div style="text-align: center">
        <img
          src="https://application-process.codeyourfuture.io/static/media/logo-cyf.fbcea877.png"
          width="250px"
          hight="250px"
          alt="Code Your future"
        />
        <p style="font-size:20px">
          Click below to sign in to your Application process.
        </p>
        <div
          style="padding:20px; margin:40px;"
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href=${config.appUrl}/application-process/magic-link/${token}
            style="background-color:#db4437; padding:20px; color:#fff; border-radius:5px; font-size:20px"
          >
            Log in
          </a>
        </div>
        <p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="http://codeyourfuture.io"
          >
            http://codeyourfuture.io
          </a>
          - Follow us on
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com/codeyourfuture.io/"
          >
            Facebook
          </a>
          and
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/CodeYourFuture_"
          >
            Twitter
          </a>
          <br />
          Read more about our project on
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.ft.com/content/cd3842d4-8902-11e7-afd2-74b8ecd34d3b"
          >
            FT,
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.wired.co.uk/article/codeyourfuture-refugee-coding-school"
          >
            Wired,
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.bbc.co.uk/programmes/p04yzrrg"
          >
            BBC Tech Tent,
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.unhcr.org/news/stories/2017/1/586e420c7/volunteers-train-refugees-to-crack-into-london-tech-industry.html"
          >
            UNHCR,
          </a>
          and
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.newsdeeply.com/refugees/articles/2016/10/19/welcome-to-londons-refugee-coding-school"
          >
            NewsDeeply
          </a>
        </p>
      </div>
      </div>`
      const city = await getCityFromCache(applicant.cityId)
      const LoginEmailData = {
        toEmail: applicant.email,
        subject: 'CYF - Sign In',
        html: loginEmail,
        replyToEmail: city.email,
        sourceEmail: city.email
      }
      const emailSend = await mailer(LoginEmailData)
      if (emailSend && emailSend.MessageId) {
        return res.sendStatus(200)
      }
    }
    return res.status(400).send({
      success: false,
      err: 'Wrong email address.'
    })
  } catch (err) {
    await logError(err, req)
    return res
      .status(400)
      .send({ err: 'Somethings went wrong please try again later.' })
  }
}

export const loginWithMagicLink = async (req, res) => {
  try {
    const loginLink = await loginWithMagicLinkHelper(req.params.token)
    return res.redirect(loginLink)
  } catch (err) {
    await logError(err, req)
    return res.redirect(
      `${config.applicationProcessClientUrl}/authentication-failed`
    )
  }
}

export const updateApplicant = async (req, res) => {
  const applicantData = req.body
  const { userId } = req.params
  try {
    const applicant = await StudentContext.findOneAndUpdate(
      { userId },
      applicantData
    )
    await updateApplicantCache(applicant)
    return res.status(200).send({
      applicant
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not edit Applicant.')
  }
}
