import { logError } from '../../common/contexts/log'
import {
  getListOfVolunteers,
  _createVolunteer,
  _updateVolunteer,
  _deleteVolunteer,
  filterVolunteers,
  _reorderVolunteer,
  _archiveVolunteer,
  _volunteerComment,
  sendMagicLinkToVolunteer,
  _updateVolunteerByMagicLink
} from '../useCases/utils'
import { pancakeSort } from '../../../helpers/index'
import config from '../../../config'
import { unsafeTokenDecoder } from '../../helpers/tokenDecoder'

export const createVolunteer = async (req, res) => {
  try {
    const volunteer = await _createVolunteer(req.body)
    return res.status(200).send({ volunteer })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send({ error: err.message })
  }
}

export const updateVolunteer = async (req, res) => {
  const { userId } = req.params
  const volunteerData = req.body
  try {
    const volunteer = await _updateVolunteer(userId, volunteerData)
    return res.status(200).send({ volunteer })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not update volunteer.')
  }
}
export const reorderVolunteer = async (req, res) => {
  const { id } = req.params
  const volunteerData = req.body
  try {
    const volunteer = await _reorderVolunteer(id, volunteerData)
    return res.status(200).send({ volunteer })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not reorder volunteer.')
  }
}
export const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await _deleteVolunteer(req.params.userId)
    return res.status(201).send({
      volunteer
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not delete volunteer.')
  }
}

export const archiveVolunteer = async (req, res) => {
  try {
    const volunteer = await _archiveVolunteer(req.params.id, req.body.archive)
    return res.status(201).send({
      volunteer
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not archive volunteer.')
  }
}

export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await getListOfVolunteers()
    const filteredVolunteers = await filterVolunteers(
      volunteers,
      req.query,
      req.user
    )
    const sortedVolunteers = await filteredVolunteers.sort(
      pancakeSort('pos', true)
    )
    if (filteredVolunteers && filteredVolunteers.length === 0) {
      return res.status(200).send({
        volunteers: [],
        msg: 'No entries found for your selection 🤷‍'
      })
    }
    return res.status(200).send({
      volunteers: sortedVolunteers
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get volunteers.')
  }
}

export const volunteerComment = async (req, res) => {
  try {
    const volunteer = await _volunteerComment(
      req.params.id,
      req.body.comment,
      req.user
    )
    return res.status(201).send({
      volunteer
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create comment.')
  }
}
export const verifyVolunteer = async (req, res) => {
  if (req.body.email === '') {
    return res.status(400).send({
      err: 'EMAIL_EMPTY'
    })
  }
  try {
    await sendMagicLinkToVolunteer(
      req.body.email.toLowerCase(),
      req.body.userId
    )
    return res.sendStatus(200)
  } catch (err) {
    await logError(err, req)
    return res.status(400).send(err.message)
  }
}

export const updateVolunteerByMagicLink = async (req, res) => {
  const authorizationToken = req.params.token
  const checkedToken = unsafeTokenDecoder(authorizationToken)
  try {
    if (!checkedToken) {
      throw new Error('failed')
    }
    const volunteerClientUrl = await _updateVolunteerByMagicLink(checkedToken)
    return res.redirect(volunteerClientUrl)
  } catch (err) {
    await logError(err, req)
    return res.redirect(
      `${config.volunteerClientUrl}/code/${checkedToken.userId}/failed`
    )
  }
}
