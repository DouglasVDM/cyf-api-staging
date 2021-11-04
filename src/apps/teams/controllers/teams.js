import TeamsContext from '../contexts/teams'
import { logError } from '../../common/contexts/log'

export const createTeam = async (req, res) => {
  try {
    const team = await TeamsContext.create(req.body)
    return res.status(200).send({
      team
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create team')
  }
}

export const getTeams = async (req, res) => {
  try {
    const teams = await TeamsContext.findAll()
    return res.status(200).send({ teams })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get teams.')
  }
}

export const updateTeam = async (req, res) => {
  try {
    const team = await TeamsContext.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    )
    return res.status(200).send({
      team
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not update team')
  }
}

export const deleteTeam = async (req, res) => {
  try {
    const team = await TeamsContext.hardDelete({ _id: req.params.id })
    return res.status(200).send(team)
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not delete team')
  }
}
