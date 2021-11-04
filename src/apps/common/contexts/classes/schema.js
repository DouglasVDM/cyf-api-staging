import { Schema, model } from 'mongoose'

const Classes = new Schema(
  {
    name: String,
    cityId: String,
    address: String,
    classDay: String,
    startedAt: Date,
    studentIds: [String]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const ClassesModel = model('classes', Classes)

export default ClassesModel
