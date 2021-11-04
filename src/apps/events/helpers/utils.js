import mailer from '../../helpers/mailer'
import config from '../../../config'
export const cyfLinks = `
<img src="https://application-process.codeyourfuture.io/static/media/logo-cyf.fbcea877.png" width="250px" hight="250px" alt="Code Your future"/>
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

export const sendEmailToVolunteer = (volunteer, event) => {
  const html = `
  <div>
    <p>Dear ${volunteer.firstName}  </p> 
    <p>Thank you for your interest in attending our event <strong>${event.name}</strong>.
    If you need any further information please follow the link below.</p>
    <a href='${config.eventsClientUrl}/event/${event._id}'>${event.name}</a>
    <p>Kind regards, </p>
    ${cyfLinks}
  </div>`
  try {
    const emailData = {
      toEmail: volunteer.email,
      subject: 'Thank you for volunteering',
      html,
      replyToEmail: config.emails.events,
      sourceEmail: config.emails.events
    }
    return mailer(emailData)
  } catch (error) {
    throw new Error(error)
  }
}
