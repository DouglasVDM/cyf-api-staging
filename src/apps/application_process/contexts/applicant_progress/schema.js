import { Schema, model } from 'mongoose'

const url = new Schema({
  url: String,
  reviewerUserId: String,
  reviewerFullName: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
})
const message = new Schema({
  userId: String,
  senderName: String,
  message: String,
  createdAt: Date,
  updatedAt: Date,
  senderId: String
})
const feedbackPoint = new Schema({
  userId: String,
  text: String,
  done: {
    type: Boolean,
    default: false
  },
  accepted: {
    type: Boolean,
    default: false
  },
  createdAt: Date,
  updatedAt: Date
})
const reviewer = new Schema({
  reviewerUserId: String,
  reviewerFullName: String,
  reviewedAt: Date,
  action: Object
})
const applicantProgress = new Schema(
  {
    userId: String,
    stepId: {
      type: String
    },
    status: {
      type: String,
      default: 'Not submitted'
    },
    urls: [url],
    messages: [message],
    feedbackPoints: [feedbackPoint],
    motivationalLetter: String,
    reviewer: [reviewer]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

// applicantProgress.index({ userId: 1, stepId: 1 }, { unique: true })
const applicantProgressModel = model('applicant_progress', applicantProgress)

export default applicantProgressModel
