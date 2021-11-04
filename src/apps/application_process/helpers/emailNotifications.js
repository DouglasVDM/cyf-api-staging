import mailer from '../../helpers/mailer'
import config from '../../../config'
import { getCityFromCache } from '../../../useCases/CacheUtils'
import { ApplicantRegistrationWelcomeElailTemplate } from '../../../email.templates/applicant.registration.welcome'
export const cyfLinks = `
<img src="https://codeyourfuture.io/wp-content/uploads/2019/03/cyf_brand.png" width="250px" hight="250px" alt="Code Your future"/>
<p>
   <a target='_blank' rel='noopener noreferrer' href="http://codeyourfuture.io">http://codeyourfuture.io</a> - Follow us on
   <a target='_blank' rel='noopener noreferrer' href="https://www.facebook.com/codeyourfuture.io/">Facebook</a> and
   <a target='_blank' rel='noopener noreferrer' href="https://twitter.com/CodeYourFuture_">Twitter</a><br/>
     Read more about our project on
     <a target='_blank' rel='noopener noreferrer' href="https://www.ft.com/content/cd3842d4-8902-11e7-afd2-74b8ecd34d3b">FT, </a>
     <a target='_blank' rel='noopener noreferrer' href="https://www.wired.co.uk/article/codeyourfuture-refugee-coding-school">Wired, </a>
     <a target='_blank' rel='noopener noreferrer' href="https://www.bbc.co.uk/programmes/p04yzrrg">BBC Tech Tent, </a>
     <a target='_blank' rel='noopener noreferrer' href="https://www.unhcr.org/news/stories/2017/1/586e420c7/volunteers-train-refugees-to-crack-into-london-tech-industry.html">UNHCR, </a>and
     <a target='_blank' rel='noopener noreferrer' href="https://www.newsdeeply.com/refugees/articles/2016/10/19/welcome-to-londons-refugee-coding-school"> NewsDeeply</a>
 </p>
`
export const urlSubmittedNotifications = (applicant, city) => {
  try {
    const html = `
    <div>
    <ul>
      <h3>New URL Submitted</h3>
      <li>Applicant name: <strong>${applicant.fullName} </strong></li>
      <li>Applicant city: <strong>${applicant.city}</strong> </li>
      <li>Applicant CYF-city: <strong>${city.name} </strong></li>
      <li>Applicant page: <strong>${config.dashboardClientUrl}/applicants/?${applicant.fullName}</li>
      <li>Submitted URL: <strong>${applicant.url}</li>
    </ul>
    ${cyfLinks}
    </div>`
    const emailData = {
      toEmail: city.email,
      subject: 'Applicant Progress',
      html,
      replyToEmail: applicant.email,
      sourceEmail: city.email
    }
    return mailer(emailData)
  } catch (err) {
    throw new Error(err)
  }
}

export const registrationNotificationsToCYF = (applicant, cyfEmail) => {
  try {
    const ToCyfMassage = `
    <div>
      <ul>
        <h3>New applicant</h3>
        <li>Applicant name: <strong>${applicant.fullName} </strong></li>
        <li>Applicant city: <strong>${applicant.city}</strong> </li>
        <li>Applicant: <strong>${config.dashboardClientUrl}/applicants/?${applicant.fullName}</li>
      </ul>
    ${cyfLinks}
    </div>
    `
    const ToCyfEmailData = {
      toEmail: config.appEmail,
      subject: 'Applicant Progress',
      html: ToCyfMassage,
      replyToEmail: applicant.email,
      sourceEmail: cyfEmail
    }
    return mailer(ToCyfEmailData)
  } catch (err) {
    throw new Error(err)
  }
}

export const registrationNotificationsToStudent = (applicant, cyfEmail) => {
  try {
    const ToApplicantEmailData = {
      toEmail: applicant.email,
      subject: ' CYF - Welcome Applicant!',
      html: ApplicantRegistrationWelcomeElailTemplate,
      replyToEmail: cyfEmail,
      sourceEmail: cyfEmail
    }
    return mailer(ToApplicantEmailData)
  } catch (err) {
    throw new Error(err)
  }
}

// this method is under testing
export const mentorCommentToStudentNotification = (body, city) => {
  const ToApplicantMassage = `
      <div>
        <p> Dear applicant,</p>
        <p> You have received a new comment from a mentor on your application. Please see a message below.</p>
        <p>${body.message}</p>
        <p>To reply to this message, please login into your profile on ${config.applicationProcessClientUrl}/applicant-step/${body.stepId}.</p>
        <p> Regards,</p>
        <p>CYF Team</p>
        ${cyfLinks}
      </div>`
  const ToApplicantEmailData = {
    toEmail: body.email,
    subject: ' CYF - Notification!',
    html: ToApplicantMassage,
    replyToEmail: city.email,
    sourceEmail: city.email
  }
  return mailer(ToApplicantEmailData)
}
export const applicantCommentToCyfCityNotification = (message, user, city) => {
  const ToCyfCity = `
      <div>
        <p>Dear Sir/Madam,</p>
        <p>You have received a new comment from a applicant on his application. Please see a message below.</p>
        <p>${message}</p>
        <p>To reply to this message, please login into your profile on ${config.dashboardClientUrl}/applicants</p>
        <p>Link to applicant ${config.dashboardClientUrl}/applicant/${user.userId}</p>
        <p>Regards,</p>
        <p>CYF Team</p>
        ${cyfLinks}
      </div>`
  const ToCyfEmailData = {
    toEmail: city.email,
    subject: ' CYF - Notification!',
    html: ToCyfCity,
    replyToEmail: user.email,
    sourceEmail: city.email
  }
  return mailer(ToCyfEmailData)
}

export const urlApprovalNotification = (email, stepId, status, cyfEmail) => {
  const ToApplicantMassage = `
      <div>
        <p> Dear applicant,</p>
        ${
          status === 'Approved'
            ? `<div>
          <p>Great job, your application step submission has been approved by a mentor.</p>
          <p>Step: ${config.applicationProcessClientUrl}/applicant-step/${stepId}</p>
          <p>You can continue your journey by logging in to your profile on ${config.applicationProcessClientUrl}.</p>
        </div>`
            : `<div>
          <p>Thank you for submitting your progress for review. Our mentors have reviewed your submission and believe it to be incomplete.</p>
          <p>Step: ${config.applicationProcessClientUrl}/applicant-step/${stepId}</p>
          <p>You can review their feedback and complete your current step by logging in to your profile on ${config.applicationProcessClientUrl}.</p>
        </div>`
        }
        <p>Regards,</p>
        <p>CYF Team</p>
        ${cyfLinks}
      </div>`
  const ToApplicantEmailData = {
    toEmail: email,
    subject: 'CYF - Notification!',
    html: ToApplicantMassage,
    replyToEmail: cyfEmail,
    sourceEmail: cyfEmail
  }
  return mailer(ToApplicantEmailData)
}

export const emailNotificatinOnCommentsInApplicationProcess = async (
  body,
  user,
  headers
) => {
  const city = await getCityFromCache(user.cityId)
  if (headers.application === 'dashboard') {
    mentorCommentToStudentNotification(body, city)
  }
  if (headers.application === 'application-process') {
    applicantCommentToCyfCityNotification(body.message, user, city)
  }
}

export const urlStep4SubmittedNotifications = (applicant, city) => {
  try {
    const html = `
    <div>
    <div>
    <p>Dear Applicant,</p>
    <p>Congratulations on completing your second website. Well done! Soon a reviewer will take a look at your job.</p>
    <p>In the meantime, we need you start implementing the best practices of modern websites.
    Please review and follow this document: 
    <a target='_blank' rel='noopener noreferrer' href="https://docs.google.com/document/d/1Cm8GG35RNiLicHLNz531TsQq4wMbz-ym4ztgZZXMdUw/edit">https://docs.google.com/document/</a></p>
    </div>
    ${cyfLinks}
    </div>`
    const emailData = {
      toEmail: applicant.email,
      subject: 'Applicant Progress',
      html,
      replyToEmail: city.email,
      sourceEmail: city.email
    }
    return mailer(emailData)
  } catch (err) {
    throw new Error(err)
  }
}

export const urlStepsSubmittedNotifications = (applicant, city) => {
  try {
    const html = `
    <div>
    <div>
    <p>Dear Applicant,</p>
    <p>You have to be proud of yourself! You have completed a step in the process and closer to becoming part of our community.</p>
    <p>Log into our system and start working on the next step so that you can be eligible to one of the spots of our program.
    Check the next steps here:
    <a target='_blank' rel='noopener noreferrer' href="https://application-process.codeyourfuture.io">https://application-process.codeyourfuture.io</a></p>
    <p>Regards,</p>
    <p>CYF Team</p>
    </div>
    ${cyfLinks}
    </div>`
    const emailData = {
      toEmail: applicant.email,
      subject: 'Applicant Progress',
      html,
      replyToEmail: city.email,
      sourceEmail: city.email
    }
    return mailer(emailData)
  } catch (err) {
    throw new Error(err)
  }
}
