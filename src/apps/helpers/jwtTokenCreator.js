import jwt from 'jsonwebtoken'

export default async function JwtTokenCreator(data, expiresIn = '2h') {
  const {
    _id,
    userId,
    fullName,
    firstName,
    lastName,
    email,
    city,
    admin,
    cityId,
    superAdmin,
    roles,
    volunteerId
  } = data
  try {
    const tokenData = {
      _id,
      userId,
      fullName: fullName || `${firstName} ${lastName}`,
      email,
      admin,
      city,
      cityId,
      superAdmin,
      roles,
      volunteerId
    }
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn })
    return token
  } catch (err) {
    return err
  }
}
