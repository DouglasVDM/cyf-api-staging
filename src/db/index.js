import mongoose from 'mongoose'
import config from '../config'
import { logSimple, logErrorSimple } from '../apps/common/contexts/log/index'

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}

export default async function connectToDb() {
  const { db, env } = config
  try {
    if (env === 'test') {
      await mongoose.connect(db.testdb, mongooseOptions)
      return
    }
    logSimple(`Connecting to ${env} DB`)
    await mongoose.connect(db.connection, mongooseOptions)
  } catch (e) {
    logErrorSimple(e, 'Error connecting to db')
  }
}

export async function closeDbConnection() {
  await mongoose.connection.close()
}
