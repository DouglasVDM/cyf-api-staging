import { cyfLinks } from '../../application_process/helpers/emailNotifications'
import mailer from '../../helpers/mailer'
import config from '../../../config'

export const expenseStatusNotification = (fullName, email, status, comment) => {
  const commentText = comment
    ? `<p style="color: red;font-weight: 900">The reason for the rejected expense claim form? </p><p>${comment}</p>`
    : ''

  try {
    const html = `
    <section>
    <h2>Hi ${fullName},<h2>
    <p>Your expense claim form has been reviewed and ${status}.<p>
    ${commentText}
    <p>An update to your current expenses can be viewed in your dashboard.</p>
    <p>If you have any questions, please contact expenses on ${config.emails.expenses}</p>
    ${cyfLinks}
    </section>`
    const emailData = {
      toEmail: email,
      subject: `Expense Submission ${status}`,
      html,
      replyToEmail: config.emails.expenses,
      sourceEmail: config.emails.expenses
    }
    return mailer(emailData)
  } catch (err) {
    throw new Error(err)
  }
}
