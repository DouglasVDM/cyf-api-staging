import { Schema, model } from 'mongoose'

const Apps = new Schema(
  {
    name: {
      type: String
    },
    url: {
      type: String
    },
    token: {
      type: String
    },
    creatorId: {
      type: String
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const AppsModel = model('apps', Apps)

export default AppsModel
