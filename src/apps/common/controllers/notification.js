import mailer from '../../helpers/mailer'
import { logError } from '../contexts/log'
import { cyfLinks } from '../../application_process/helpers/emailNotifications'
import { getCityFromCache } from '../../../useCases/CacheUtils'
import sendSMS from '../../helpers/sms'

export const sendEmail = async (req, res) => {
  try {
    const html = `<div>
      ${req.body.emailText}
      ${cyfLinks}
      </div>`
    const city = await getCityFromCache(req.user.cityId)
    const EmailData = {
      toEmail: req.body.emails,
      subject: req.body.subject,
      html,
      replyToEmail: city.email,
      sourceEmail: city.email
    }
    const emailSend = await mailer(EmailData)
    if (emailSend && emailSend.length > 0 && emailSend[0].MessageId) {
      return res.status(200).send({ msg: 'Email send success.' })
    }
  } catch (err) {
    await logError(err, req)
    return res
      .status(400)
      .send({ err: 'Somethings went wrong please try again later.' })
  }
}

export const _sendSMS = async (req, res) => {
  try {
    const phoneNumbers = req.body.phoneNumbers
    const message = req.body.message
    const response = await Promise.all(
      phoneNumbers.map(async number => {
        await sendSMS(number, message)
      })
    )
    return res.status(200).send({ msg: 'SMS send success.', response })
  } catch (err) {
    await logError(err, req)
    return res
      .status(400)
      .send({ err: 'Somethings went wrong please try again later.' })
  }
}
