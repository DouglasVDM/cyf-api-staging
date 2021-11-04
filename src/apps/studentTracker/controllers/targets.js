import TargetsContext from '../contexts/targets'
import { logError } from '../../common/contexts/log'
import dayjs from 'dayjs'
export const createStudentsTarget = async (req, res) => {
  try {
    const targetData = {
      name: req.body.name,
      startingDate: dayjs(req.body.startingDate),
      finishingDate: dayjs(req.body.finishingDate),
      targetCalls: Number(req.body.targetCalls),
      targetThreads: Number(req.body.targetThreads),
      channelId: req.body.selectedChannelId,
      classId: req.body.classId,
      mentorId: req.body.mentorId
    }
    const target = await TargetsContext.create(targetData)
    res.status(200).send({
      target
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create target')
  }
}

export const getStudentsTargets = async (req, res) => {
  try {
    const classId = req.query.id
    const targets = await TargetsContext.findAll({ classId })
    return res.status(200).send(targets)
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get targets.')
  }
}
