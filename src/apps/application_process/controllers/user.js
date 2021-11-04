import UserContext from '../../common/contexts/user'
import StudentContext from '../../application_process/contexts/students'
import { logError } from '../../common/contexts/log'
import { updateUserCache } from '../helpers/updateRedis'

export const createUserForStudent = async (req, res) => {
  const email = req.body.email.toLowerCase()
  if (email === '') {
    return res.status(400).send({
      success: false,
      err: 'Email cannot be empty.'
    })
  }
  try {
    const user = await UserContext.findOrCreateUserForStudent({ email })
    const student = await StudentContext.findOneStudent({
      userId: user._id
    })
    if (student) {
      return res.status(400).send({
        success: false,
        err:
          'Email address already exist, please use login page to login to your profile.'
      })
    }
    return res.status(200).send({
      user
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send({ error: err.message })
  }
}

export const editUser = async (req, res) => {
  const { adminData, _id } = req.body
  try {
    const admin = await UserContext.findOneAndUpdate({ _id }, adminData)
    await updateUserCache(admin)
    return res.status(200).send({
      admin,
      msg: 'Success, your changes has been saved.'
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not edit user.')
  }
}
