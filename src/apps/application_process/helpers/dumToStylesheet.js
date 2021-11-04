import { google } from 'googleapis'
import config from '../../../config'
import { formateDate, sortSteps, calculatingNumberOfMessages } from './helpers'

const googleClient = new google.auth.JWT(
  config.clientEmailForSpreadsheet,
  null,
  config.privateKeyForSpreaddsheet,
  ['https://www.googleapis.com/auth/spreadsheets']
)

async function metricsSheetUpdate(cl, data) {
  try {
    const gsapi = google.sheets({ version: 'v4', auth: cl })

    const values = [
      [
        'User ID',
        'User Name',
        'City',
        'Experience',
        'No of messages sent',
        'Step 1 Approval Date',
        'Step 2 Approval Date',
        'Step 3 Approval Date',
        'Step 4 Approval Date'
      ]
    ]
    const sortedData = data.sort(sortSteps('city'))
    sortedData.forEach(student => {
      const step1 = student.steps.find(step => step.number === 1)
      const step2 = student.steps.find(step => step.number === 2)
      const step3 = student.steps.find(step => step.number === 3)
      const step4 = student.steps.find(step => step.number === 4)

      const step1Submission =
        step1 && step1.urls.length > 0
          ? formateDate(step1.urls[step1.urls.length - 1]._id.getTimestamp())
          : 'Not Submitted'
      const step2Submission =
        step2 && step2.urls.length > 0
          ? formateDate(step2.urls[step2.urls.length - 1]._id.getTimestamp())
          : 'Not Submitted'
      const step3Submission =
        step3 && step3.urls.length > 0
          ? formateDate(step3.urls[step3.urls.length - 1]._id.getTimestamp())
          : 'Not Submitted'
      const step4Submission =
        step4 && step4.urls.length > 0
          ? formateDate(step4.urls[step4.urls.length - 1]._id.getTimestamp())
          : 'Not Submitted'
      const numebrOfMessages = calculatingNumberOfMessages([
        step1 || 0,
        step2 || 0,
        step3 || 0,
        step4 || 0
      ])

      values.push([
        student._id,
        student.fullName,
        student.city,
        student.experience,
        numebrOfMessages,
        step1Submission,
        step2Submission,
        step3Submission,
        step4Submission
      ])
    })
    const updateOption = {
      spreadsheetId: '1aSOzfQsvUhpT-LTiKc5Qt0o4lYk2BA3x2ONDfvIZnhQ',
      range: 'sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    }
    await gsapi.spreadsheets.values.update(updateOption)
  } catch (err) {
    throw new Error(err)
  }
}

const dumpToSpreadsheet = data => {
  try {
    googleClient.authorize((error, token) => {
      if (error) {
        return error
      }
      return metricsSheetUpdate(googleClient, data, token)
    })
  } catch (err) {
    throw new Error(err)
  }
}
export default dumpToSpreadsheet
