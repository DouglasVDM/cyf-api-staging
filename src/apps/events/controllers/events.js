/* eslint-disable no-console */
import mongoose from 'mongoose'
import EventsContext from '../contexts/events'
import UserContext from '../../common/contexts/user'
import { logError } from '../../common/contexts/log'
import { sendEmailToVolunteer } from '../helpers/utils'
import { createUser } from '../../common/useCases/utils'
import JwtTokenCreator from '../../helpers/jwtTokenCreator'
// function onlyGetMyEvents() {
//   if (req.params.userId) {
//     const newEvents = events.map(event => {
//       return {
//         ...event,
//         isVolunteering: event.volunteers.includes(req.params.userId),
//         volunteersCount: event.volunteers.length,
//         volunteers: 'Private',
//       }
//     })
//     return res.status(200).send({ newEvents })
//   }
// }

async function getSingleEvent(eventId) {
  try {
    const event = await EventsContext.findById({ _id: eventId })
    return event
  } catch (err) {
    console.error(err)
    return new Error(err.message)
  }
}
export const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params
    if (eventId) {
      const result = await getSingleEvent(eventId)
      return res.status(200).send({ event: result })
    }
    const events = await EventsContext.findAll()
    return res.status(200).send({ events })

    // return res.status(200).send({ events })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Events.')
  }
}

export const getEvents = async (req, res) => {
  try {
    const { id } = req.query
    if (id) {
      return getSingleEvent(id, res)
    }
    const { city } = req.params
    const events =
      city === undefined || city === 'All'
        ? await EventsContext.findAll()
        : await EventsContext.findAll({ city })

    return res.status(200).send({ events })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Events.')
  }
}

export const createEvent = async (req, res) => {
  try {
    const event = await EventsContext.create(req.body)
    return res.status(201).send({
      event
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create Event.')
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const event = await EventsContext.hardDelete({ _id: req.params.eventId })
    return res.status(204).send({
      event
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not delete Event.')
  }
}

export const putEvent = async (req, res) => {
  const eventData = req.body
  try {
    const event = await EventsContext.findOneAndUpdate(
      { _id: req.params.eventId },
      eventData
    )

    return res.status(200).send({
      event
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not update Event.')
  }
}

export const getEventVolunteerCount = async (req, res) => {
  try {
    const IdsObj = await EventsContext.findById(
      { _id: req.params.eventId },
      { _id: 0, volunteers: 1 }
    )
    const count = IdsObj.volunteers ? IdsObj.volunteers.length : 0
    return res.status(200).send({
      count
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Event Volunteer Count.')
  }
}

export const getEventVolunteers = async (req, res) => {
  try {
    const IdsObj = await EventsContext.findById(
      { _id: req.params.eventId },
      { _id: 0, volunteers: 1 }
    )
    const volunteerIds = IdsObj.volunteers.map(id => {
      return new mongoose.Types.ObjectId(id)
    })
    const volunteers = await UserContext.findAll(
      { _id: { $in: volunteerIds } },
      { firstName: 1, lastName: 1, email: 1 }
    )
    return res.status(200).send({
      volunteers
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Event Volunteers.')
  }
}
const setVolunteerToEvent = async (user, eventId) => {
  try {
    return EventsContext.findOneAndUpdate(
      { _id: eventId },
      {
        $addToSet: {
          volunteers: [
            {
              userId: user.userId,
              firstName: user.firstName,
              createdAt: new Date()
            }
          ]
        }
      }
    )
  } catch (err) {
    throw new Error(err)
  }
}
export const addVolunteerToEvent = async (req, res) => {
  const { _id, firstName } = req.user
  try {
    const event = await setVolunteerToEvent(
      { userId: _id, firstName },
      req.params.eventId
    )
    sendEmailToVolunteer(req.user, event)
    return res.status(200).send({
      message: 'Volunteer added successfully'
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not add Event Volunteer.')
  }
}

export const removeEventVolunteer = async (req, res) => {
  const userId = req.user._id
  try {
    await EventsContext.findOneAndUpdate(
      { _id: req.params.eventId },
      {
        $pull: {
          volunteers: {
            userId
          }
        }
      }
    )
    return res.status(200).send({
      message: 'Volunteer removed successfully'
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not remove Event Volunteer.')
  }
}

export const registration = async (req, res) => {
  const { firstName, lastName, email, eventId } = req.body
  try {
    const user = await createUser({ firstName, lastName, email })
    if (user) {
      const event = await setVolunteerToEvent(
        { userId: user._id, firstName: user.firstName },
        eventId
      )
      sendEmailToVolunteer(user, event)
      const token = await JwtTokenCreator(user)
      return res.status(200).send({
        token
      })
    } else {
      throw new Error('NO_USER')
    }
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not register, tray later.')
  }
}
