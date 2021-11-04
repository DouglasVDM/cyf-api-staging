import mongoose, { Schema, model } from 'mongoose'
import mongooseSchemaJSONSchema from 'mongoose-schema-jsonschema'

mongooseSchemaJSONSchema(mongoose)

const Teams = new Schema({
  name: String,
  leaderEmail: String,
  description: String,
  cityId: String,
  global: {
    type: Boolean,
    default: false
  }
})

const TeamsModel = model('team', Teams)
export const TeamsJSONSchema = Teams.jsonSchema()
export default TeamsModel
