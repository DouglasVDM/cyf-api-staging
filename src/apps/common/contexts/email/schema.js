import { Schema, model } from 'mongoose'

const emailSchema = new Schema(
  {
    language: {
      type: String,
      required: true,
      trim: true
    },
    teamId: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const emailModel = model('email', emailSchema)

export default emailModel
