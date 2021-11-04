import EmailContexts from '../contexts/email'
import UserContexts from '../contexts/user'
import { deleteAdminFromCache } from '../../../useCases/CacheUtils'

export const createUser = async userData => {
  try {
    return UserContexts.findOrCreateUser(userData)
  } catch (err) {
    throw new Error({ err })
  }
}

export const getUserByEmail = async email => {
  try {
    return UserContexts.showEmail({ email })
  } catch (err) {
    throw new Error({ err })
  }
}

export const getUser = async userData => {
  try {
    const { _id } = userData
    return UserContexts.findById({ _id })
  } catch (err) {
    throw new Error({ err })
  }
}

export const editUser = async (_id, userData) => {
  try {
    return UserContexts.findOneAndUpdate(_id, userData)
  } catch (err) {
    throw new Error({ err })
  }
}

export const deleteUser = async _id => {
  try {
    const user = await UserContexts.deleteById({ _id })
    if (user.deletedCount !== 1) {
      throw new Error("Couldn't delete the user")
    }
    await deleteAdminFromCache(_id)
    return user
  } catch (err) {
    throw new Error({ err })
  }
}

export const createEmail = async email => {
  try {
    return EmailContexts.findOrCreate(email)
  } catch (err) {
    throw new Error(err)
  }
}

export const getEmails = async email => {
  try {
    return EmailContexts.findAll(email)
  } catch (err) {
    throw new Error(err)
  }
}
export const editEmail = async (id, email) => {
  try {
    return EmailContexts.findOneAndUpdate(id, email)
  } catch (err) {
    throw new Error(err)
  }
}
export const deleteEmail = async id => {
  try {
    return EmailContexts.deleteById(id)
  } catch (err) {
    throw new Error(err)
  }
}
