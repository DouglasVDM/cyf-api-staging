const { WebClient } = require('@slack/client')
import { logError } from '../../common/contexts/log'
export const getAllCallsAndMessages = async (req, res) => {
  let { channelId, startingDate, finishingDate } = req.query

  try {
    const response = await getAllCallsAndMessagesFromSlack(
      channelId,
      startingDate,
      finishingDate
    )
    res.status(200).send(response)
  } catch (err) {
    await logError(err, req)
  }
}
export const getAllCallsAndMessagesFromSlack = async (
  channelId,
  startingDate,
  finishingDate
) => {
  const token = process.env.SLACK_ACTIVITY_TOKEN
  const web = new WebClient()

  try {
    const res = await web.channels.history({
      token,
      oldest: startingDate, //startingDate ,
      latest: finishingDate, //finishingDate,
      channel: channelId
    })
    return res
  } catch (err) {
    throw new Error(err)
  }
}
