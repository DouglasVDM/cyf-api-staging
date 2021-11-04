import mongoose, { Schema, model } from 'mongoose'
import mongooseSchemaJSONSchema from 'mongoose-schema-jsonschema'

mongooseSchemaJSONSchema(mongoose)

const volunteer = new Schema({
  userId: String,
  avatarURL: String,
  firstName: String,
  createdAt: Date
})

const Events = new Schema(
  {
    name: {
      type: String,
      required: 'please write your event name.',
      trim: true
    },
    occurAtDate: {
      type: Date,
      required: 'please write your event date.'
    },
    occurAtTime: {
      type: Date,
      required: 'please write your event start time.'
    },
    finishAtTime: Date,
    description: String,
    address: String,
    country: String,
    city: String,
    url: {
      type: String,
      trim: true
    },
    category: String,
    cityId: {
      type: String,
      required: 'please write your event city.'
    },
    volunteers: [volunteer]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const EventsModel = model('event', Events)
export const EventJSONSchema = Events.jsonSchema()
export default EventsModel
