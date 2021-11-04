import { Schema, model } from 'mongoose'

const listsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    pos: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)
const listsModel = model('lists', listsSchema)
export default listsModel
