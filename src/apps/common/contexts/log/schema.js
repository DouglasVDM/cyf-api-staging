import { Schema, model } from 'mongoose'

const Logs = new Schema(
  {
    userId: String,
    category: String,
    event: Object,
    app: String,
    url: String,
    message: String,
    body: Object,
    client: Object
  },
  { timestamps: { createdAt: true } }
)

const LogsModel = model('log', Logs)

export default LogsModel
