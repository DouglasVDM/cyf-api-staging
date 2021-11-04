import decode from 'jwt-decode'

export default function tokenDecoder(token) {
  try {
    const decoded = decode(token)
    if (decoded.exp < Date.now() / 1000) {
      throw new Error('TOKEN_EXPIRED')
    }
    return decoded
  } catch (err) {
    throw new Error('INVALID_TOKEN')
  }
}

export function unsafeTokenDecoder(token) {
  return decode(token)
}
