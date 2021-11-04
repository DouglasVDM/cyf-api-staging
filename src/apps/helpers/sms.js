import { sns, SMS_TYPE } from '../../config'
import { logSimple } from '../../apps/common/contexts/log'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export default async function sendSMS(PHONE_NUMBER, TEXT_MESSAGE) {
  try {
    if (!PHONE_NUMBER || !TEXT_MESSAGE) {
      throw new Error()
    }
    const phoneNumber = parsePhoneNumberFromString(PHONE_NUMBER)
    if (phoneNumber && phoneNumber.isValid()) {
      const SMS_TYPE_PARAMS = {
        attributes: {
          DefaultSMSType: SMS_TYPE.TRANSACTIONAL
        }
      }
      await sns.setSMSAttributes(SMS_TYPE_PARAMS).promise()
      const SMS_PARAMS = {
        Message: TEXT_MESSAGE,
        PhoneNumber: PHONE_NUMBER
      }
      const publishTextPromise = await sns.publish(SMS_PARAMS).promise()

      logSimple('MessageID is ' + publishTextPromise.MessageId)
    }
  } catch (err) {
    logSimple(`ERROR_SEND_SMS: ${JSON.stringify(err)}`)
    throw new Error('SEND_SMS_FAILED')
  }
}
