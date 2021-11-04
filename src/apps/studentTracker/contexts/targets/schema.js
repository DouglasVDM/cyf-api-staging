import mongoose, { Schema, model } from 'mongoose'
import mongooseSchemaJSONSchema from 'mongoose-schema-jsonschema'

mongooseSchemaJSONSchema(mongoose)

const communicationTargetSchema = new Schema(
  {
    name: String,
    startingDate: Date,
    finishingDate: Date,
    targetCalls: Number,
    targetThreads: Number,
    classId: String,
    channelId: String,
    userId: String
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)
communicationTargetSchema.index(
  { communicationTargetName: 1, classId: -1 },
  { unique: true }
)

const CommunicationTargetModel = model('target', communicationTargetSchema)

export default CommunicationTargetModel
