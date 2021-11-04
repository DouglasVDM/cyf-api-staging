import { WebClient } from '@slack/client'
import config from '../../config'

const web = new WebClient(config.slackToken)
export default async function SlackMessage(text, slackChannelId) {
  try {
    const sendMessage = await web.chat.postMessage({
      channel: slackChannelId,
      text
    })
    return sendMessage
  } catch (err) {
    return err
  }
}
