import VolunteerContext from '../contexts/volunteer'
import UserContext from '../../common/contexts/user'
import { getUser } from '../../common/useCases/utils'
import {
  getDataFromCacheByQuery,
  setCacheDataByQuery
} from '../../helpers/redis'
import {
  addNewVolunteerToCache,
  updateVolunteerCache,
  deleteVolunteerFromCache
} from '../../../useCases/CacheUtils'
import { getCityFromCache } from '../../../useCases/CacheUtils'
import mailer from '../../helpers/mailer'
import JwtTokenCreator from '../../helpers/jwtTokenCreator'
import config from '../../../config'
import { cyfLinks } from '../../application_process/helpers/emailNotifications'
const TWENTY_FOUR_HOURS = 86400000

const mergeUserWithVolunteer = (user, volunteer) => {
  return {
    teamId: volunteer.teamId,
    volunteerStatus: volunteer.volunteerStatus,
    _id: volunteer._id,
    cityId: volunteer.cityId,
    interestedInVolunteer: volunteer.interestedInVolunteer,
    interestedInCYF: volunteer.interestedInCYF,
    industry: volunteer.industry,
    hearAboutCYF: volunteer.hearAboutCYF,
    guidePeople: volunteer.guidePeople,
    techSkill: volunteer.techSkill,
    otherSkill: volunteer.otherSkill,
    userId: volunteer.userId,
    createdAt: volunteer.createdAt,
    updatedAt: volunteer.updatedAt,
    admin: user.admin,
    adminStatus: user.adminStatus,
    roles: user.roles,
    firstName: user.firstName ? user.firstName : volunteer.firstName,
    lastName: user.lastName ? user.lastName : volunteer.lastName,
    email: user.email,
    tel: user.tel,
    pos: volunteer.pos,
    listId: volunteer.listId,
    archived: volunteer.archived,
    comments: volunteer.comments
  }
}

export const getVolunteerProfile = async volunteer => {
  if (volunteer.userId) {
    const user = await getUser({ _id: volunteer.userId })
    return {
      ...user,
      ...volunteer
    }
  }
  return volunteer
}

export const cachedVolunteers = async () => {
  try {
    const volunteersData = await VolunteerContext.findAll()
    const volunteers = await Promise.all(
      volunteersData.map(volunteer => getVolunteerProfile(volunteer))
    )
    await setCacheDataByQuery('get:volunteers', volunteers, TWENTY_FOUR_HOURS)
    return volunteers
  } catch (err) {
    throw new Error(err)
  }
}

export const getListOfVolunteers = async () => {
  try {
    const cachedVersion = await getDataFromCacheByQuery('get:volunteers')
    if (cachedVersion) {
      return cachedVersion
    }
    const volunteers = await cachedVolunteers()
    return volunteers
  } catch (err) {
    throw new Error(err)
  }
}

export const _createVolunteer = async volunteerData => {
  let user
  let volunteer
  try {
    user = await UserContext.showEmail({
      email: volunteerData.email
    })
    if (user) {
      volunteer = await VolunteerContext.findOneBy({ userId: user._id })
      if (volunteer) {
        throw new Error('EMAIL_EXIST')
      }
    }
    user = await UserContext.findOrCreateUserForVolunteer({
      ...volunteerData,
      roles: ['VOLUNTEER']
    })

    volunteer = await VolunteerContext.findOneOrCreate(
      { userId: user._id },
      { ...volunteerData, userId: user._id }
    )
    const newVolunteer = mergeUserWithVolunteer(user, volunteer)
    addNewVolunteerToCache(newVolunteer)
    return newVolunteer
  } catch (err) {
    if (err.message === 'EMAIL_EXIST') {
      throw new Error('EMAIL_EXIST')
    }
    throw new Error(err)
  }
}

export const _updateVolunteer = async (userId, volunteerData) => {
  try {
    const user = await UserContext.findOneAndUpdate(
      { _id: userId },
      volunteerData
    )
    const updatedVolunteerData = await VolunteerContext.findOneAndUpdate(
      { userId },
      volunteerData
    )
    const updatedVolunteer = mergeUserWithVolunteer(user, updatedVolunteerData)
    updateVolunteerCache(updatedVolunteer)
    return updatedVolunteer
  } catch (err) {
    throw new Error(err)
  }
}

export const _reorderVolunteer = async (_id, volunteerData) => {
  try {
    const updatedVolunteerData = await VolunteerContext.findOneAndUpdate(
      { _id },
      volunteerData
    )

    const user = await UserContext.findOneAndUpdate(
      { _id: updatedVolunteerData.userId },
      volunteerData
    )
    const updatedVolunteer = mergeUserWithVolunteer(user, updatedVolunteerData)
    updateVolunteerCache(updatedVolunteer)
    return updatedVolunteer
  } catch (err) {
    throw new Error(err)
  }
}

export const _deleteVolunteer = async userId => {
  try {
    const volunteer = await VolunteerContext.hardDelete({
      userId
    })
    deleteVolunteerFromCache(userId)
    return volunteer
  } catch (err) {
    throw new Error(err)
  }
}
export const _archiveVolunteer = async (_id, archive) => {
  try {
    const updatedVolunteerData = await VolunteerContext.findOneAndUpdate(
      {
        _id
      },
      {
        archived: archive
      }
    )
    const user = await UserContext.findById({
      _id: updatedVolunteerData.userId
    })
    const volunteer = mergeUserWithVolunteer(user, updatedVolunteerData)
    updateVolunteerCache(volunteer)
    return volunteer
  } catch (err) {
    throw new Error(err)
  }
}
const checkVolunteerCityId = (volunteerCityId, cyfCityIds) => {
  if (volunteerCityId) {
    return cyfCityIds.includes(volunteerCityId)
  }
  const otherCityId = '5cefa6e0071d210018e3dcd0'
  return cyfCityIds.includes(otherCityId)
}
const checkVolunteersStatus = (volunteers, status) => {
  if (status.includes('Archived')) {
    return volunteers.filter(volunteer => {
      return volunteer.archived
    })
  } else {
    return volunteers.filter(volunteer => {
      return status.includes(volunteer.listId)
    })
  }
}
export const filterVolunteers = async (volunteers, options, user) => {
  try {
    let newVolunteers = volunteers
    newVolunteers = newVolunteers.filter(volunteer => {
      return checkVolunteerCityId(
        volunteer.cityId,
        options.cyfCityIds || user.cityId
      )
    })
    newVolunteers = options.status
      ? checkVolunteersStatus(newVolunteers, options.status)
      : newVolunteers.filter(volunteer => {
          return !volunteer.archived
        })

    newVolunteers = options.teamsIds
      ? newVolunteers.filter(volunteer => {
          return options.teamsIds.includes(volunteer.teamId)
        })
      : newVolunteers
    return newVolunteers
  } catch (err) {
    throw new Error(err)
  }
}

export const _volunteerComment = async (_id, comment, user) => {
  try {
    const updatedVolunteerData = await VolunteerContext.findOneAndUpdate(
      { _id },
      {
        $addToSet: {
          comments: [
            {
              userId: user.userId,
              senderName: user.fullName,
              comment: comment,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ]
        }
      }
    )
    const volunteerUser = await UserContext.findById({
      _id: updatedVolunteerData.userId
    })
    const updatedVolunteer = mergeUserWithVolunteer(
      volunteerUser,
      updatedVolunteerData
    )
    updateVolunteerCache(updatedVolunteer)
    return updatedVolunteer
  } catch (err) {
    throw new Error(err)
  }
}

export const sendMagicLinkToVolunteer = async (email, userId) => {
  let user
  let volunteer
  try {
    user = await UserContext.showEmail({ email })
    if (user) {
      volunteer = await VolunteerContext.findOneBy({ userId: user._id })
      if (volunteer) {
        const token = await JwtTokenCreator(
          {
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            volunteerId: volunteer._id,
            userId
          },
          '10m'
        )
        await UserContext.findOneAndUpdate({ email }, { token })
        const html = `
        <div style=" background-color: #f3f3f3; width: 100%; padding: 10px;">  
          <div style=" justify-content: center; display: flex;">
            <div style="width: 600px;">
              <p>Dear Volunteer,</p>
              <p>Please verify your email address to complete your application.</p>
              <span style="display: flex;width: 100%;justify-content: space-around;">
                <a href=${config.appUrl}/volunteer/magic-link/${token} target="_blank" rel="noopener noreferrer" style="text-decoration: none; padding: 20px;background-color: #28a745;color: #fff;cursor: pointer;border: 1px solid #757575;border-radius: 2px;">
                Verify email address
                </a>
              </span>
              <p>This link will expire in 10 minutes.</p>
            </div>
          </div>
          ${cyfLinks}
        </div>`

        const city = await getCityFromCache(user.cityId || volunteer.cityId)
        const emailData = {
          toEmail: email,
          subject: 'CYF - Please verify your email',
          html,
          replyToEmail: city.email,
          sourceEmail: city.email
        }
        const emailSend = await mailer(emailData)
        if (emailSend && emailSend.MessageId) {
          return emailSend.MessageId
        }
      } else {
        throw new Error('NO_ACCOUNT')
      }
    } else {
      throw new Error('NO_ACCOUNT')
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export async function _updateVolunteerByMagicLink(checkedToken) {
  const { userId, email, volunteerId } = checkedToken
  let newUser
  let user
  let volunteer
  if (checkedToken.exp < Date.now() / 1000) {
    throw new Error('Failed')
  }
  try {
    volunteer = await VolunteerContext.findById({ _id: volunteerId })
    if (!volunteer) {
      throw new Error('Failed')
    }
    user = await UserContext.findById({ _id: volunteer.userId })
    newUser = await UserContext.findOneAndUpdate(
      { _id: userId },
      {
        roles: user.roles,
        agreeToTOU: user.agreeToTOU,
        agreeToReceiveCommunication: user.agreeToReceiveCommunication,
        firstName: user.firstName,
        lastName: user.lastName,
        email,
        cityId: user.cityId,
        tel: user.tel
      }
    )
    await VolunteerContext.findOneAndUpdate(
      { _id: volunteerId },
      { userId: newUser._id }
    )
    if (user && newUser && volunteer) {
      if (user._id.toString() !== newUser._id.toString()) {
        await UserContext.deleteById({ _id: user._id })
      }
      const updatedVolunteer = mergeUserWithVolunteer(newUser, volunteer)
      updateVolunteerCache(updatedVolunteer)
      return `${config.volunteerClientUrl}/code/${userId}/success`
    }
    throw new Error('Failed')
  } catch (err) {
    throw new Error('Failed')
  }
}
