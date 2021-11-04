// import nodemailer from 'nodemailer'
import config, { ses } from '../../config'

const splitToGroup = emails => {
  let result = []
  while (emails.length) {
    result.push(emails.splice(0, 49))
  }
  return result
}

export default async function mailer(emailData) {
  const to =
    config.env === 'DEVELOPMENT' ? config.catchOnAllEmail : emailData.toEmail
  const replyTo =
    config.env === 'DEVELOPMENT'
      ? config.catchOnAllEmail
      : emailData.replyToEmail
  try {
    if (Array.isArray(to)) {
      const groupedEmails = splitToGroup(to)
      return Promise.all(
        groupedEmails.map(async groupEmail => {
          let params = {
            Destination: {
              BccAddresses: groupEmail
            },
            Message: {
              Body: {
                Html: {
                  Charset: 'UTF-8',
                  Data: emailData.html
                },
                Text: {
                  Charset: 'UTF-8',
                  Data: 'TEXT_FORMAT_BODY'
                }
              },
              Subject: {
                Charset: 'UTF-8',
                Data: emailData.subject
              }
            },
            Source: emailData.sourceEmail,
            ReplyToAddresses: [replyTo]
          }
          return ses.sendEmail(params).promise()
        })
      )
    } else {
      let params = {
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: emailData.html
            },
            Text: {
              Charset: 'UTF-8',
              Data: 'TEXT_FORMAT_BODY'
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: emailData.subject
          }
        },
        Source: emailData.sourceEmail,
        ReplyToAddresses: [replyTo]
      }
      return ses.sendEmail(params).promise()
    }
  } catch (err) {
    throw new Error(err)
  }
}
