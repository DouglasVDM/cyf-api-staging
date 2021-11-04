import { Schema, model } from 'mongoose'

const Feedback = new Schema(
  {
    fullName: String,
    rate_number: Number,
    date: String,
    feedback_message: {
      type: String,
      required: 'please write your feedback.',
      trim: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const FeedbackModel = model('feedback', Feedback)

export default FeedbackModel
