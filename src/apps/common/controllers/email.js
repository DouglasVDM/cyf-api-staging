import {
  createEmail,
  getEmails,
  editEmail,
  deleteEmail
} from '../useCases/utils'

export const createEmailHandler = async (req, res) => {
  try {
    const email = await createEmail(req.body)
    return res.status(200).json(email)
  } catch (err) {
    return res.status(400).json(err)
  }
}

export const getEmailsHandler = async (req, res) => {
  try {
    const emails = await getEmails()
    return res.status(200).json(emails)
  } catch (err) {
    return res.status(400).json(err)
  }
}

export const editEmailHandler = async (req, res) => {
  try {
    const _id = req.params.emailId
    const email = await editEmail({ _id }, req.body)
    return res.status(200).json(email)
  } catch (err) {
    return res.status(400).json(err)
  }
}
export const deleteEmailHandler = async (req, res) => {
  try {
    const _id = req.params.emailId
    const email = await deleteEmail({ _id })
    return res.status(200).json(email)
  } catch (err) {
    return res.status(400).json(err)
  }
}
