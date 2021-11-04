/* eslint-disable no-console */
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config()
const secret = process.env.JWT_SECRET

const [, , userId, expiresIn = '5m', payload = '{}'] = process.argv

const tokenData = {
  _id: userId,
  admin: true,
  superAdmin: true,
  ...JSON.parse(payload)
}

try {
  console.log('signing', tokenData, 'with', secret)
  const token = jwt.sign(tokenData, secret, { expiresIn })
  console.log(token)
} catch (err) {
  console.error(err)
  process.exit(1)
}
