import { Schema, model } from 'mongoose'
const acceptanceCriteria = new Schema({
  text: String,
  createdAt: Date
})
const Steps = new Schema(
  {
    number: {
      type: Number
    },
    name: {
      type: String
    },
    header: {
      type: String
    },
    description: {
      type: String
    },
    instructions: {
      type: String
    },
    version: {
      type: Number
    },
    eligibilityFromDate: {
      type: Date
    },
    eligibilityToDate: {
      type: Date
    },
    image: {
      type: String
    },
    motivation: String,
    acceptanceCriteria: [acceptanceCriteria],
    creatorId: String,
    updaterId: String,
    optional: {
      type: Boolean
    },
    category: {
      type: String,
      enum: ['CLASS_PREPARATION', 'APPLICATION_PROCESS']
    },
    showImageUpload: {
      type: Boolean,
      default: false
    },
    showSubmitUrl: {
      type: Boolean,
      default: false
    },
    showMotivationalLetter: {
      type: Boolean,
      default: false
    },
    device: {
      type: String,
      enum: ['MEDIA', 'DESKTOP']
    },
    youTubEmbedVideo: String
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const StepsModel = model('steps', Steps)

export default StepsModel
