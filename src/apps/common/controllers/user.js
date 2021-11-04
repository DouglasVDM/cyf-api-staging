import { createUser, editUser, getUser, deleteUser } from '../useCases/utils'
import { updateUserCache } from '../../application_process/helpers/updateRedis'
import { logError } from '../contexts/log'
import { _deleteVolunteer } from '../../volunteer/useCases/utils'

export const createUserHandler = async (req, res) => {
  try {
    const user = await createUser(req.body)
    return res.status(200).send({
      user
    })
  } catch (err) {
    return res.status(400).send('Could not creat user')
  }
}

export const getUserHandler = async (req, res) => {
  try {
    const user = await getUser(req.user)
    return res.status(200).send({
      user
    })
  } catch (err) {
    return res.status(400).send('Could not find user')
  }
}

export const editUserHandler = async (req, res) => {
  const { _id } = req.user
  const userData = req.body
  try {
    const user = await editUser({ _id }, userData)
    return res.status(200).send({
      user
    })
  } catch (err) {
    return res.status(400).send('Could not edit user')
  }
}

export const updateAdminRoles = async (req, res) => {
  const _id = req.params.id
  try {
    const admin = await editUser({ _id }, req.body)
    await updateUserCache(admin)
    return res.status(200).send(admin)
  } catch (err) {
    return res.status(400).send('Could not update admin roles')
  }
}

export const deleteAdmin = async (req, res) => {
  const userId = req.params.id
  try {
    const admin = await deleteUser(userId)
    await _deleteVolunteer(userId)
    if (admin.deletedCount === 0) {
      throw new Error('Could not delete admin')
    }
    return res.status(200).send(admin)
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not delete admin')
  }
}
