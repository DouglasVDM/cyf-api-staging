import { Schema, model } from 'mongoose'

const CYF_APPS = [
  'VOLUNTEER_FORM',
  'APPLICATION_PROCESS_FORM',
  'EVENT_LIST',
  'DASHBOARD'
]
const City = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    slackChannel: {
      type: String,
      required: true
    },
    slackChannelId: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String
    },
    visibleIn: {
      type: [String],
      enum: CYF_APPS
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const CityModel = model('city', City)

export default CityModel
