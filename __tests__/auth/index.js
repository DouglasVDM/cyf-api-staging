import request from 'supertest'
import userService from '../../src/apps/common/contexts/user'
import { server } from '../../src/index'
import JwtTokenCreator from '../../src/apps/helpers/jwtTokenCreator'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

let response
let fakeUser

beforeAll(async () => {
  await global.setUp()
  await global.factory.createMany('user', 1)
  const fakeUsers = await userService.findAll()
  fakeUser = fakeUsers[0]
  await global.factory.create(
    'volunteer',
    {},
    {
      userId: fakeUser._id.toJSON()
    }
  )
})

afterAll(async () => {
  await global.tearDown()
})

describe('Test authorization', () => {
  test('Get Success result when sending the token', async () => {
    //given
    const token = await JwtTokenCreator(fakeUser)

    //when
    response = await request(server)
      .post('/auth/token')
      .set('authorization', `Bearer ${token}`)
      .send({ token_type: 'refresh_token' })

    //then
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    const tokenUser = jwt.verify(response.body.token, process.env.JWT_SECRET)
    expect(fakeUser._id.toString()).toEqual(tokenUser._id)
    expect((tokenUser.exp - tokenUser.iat) / 3600).toBe(2)
  })

  test('Get 401 result when not sending the token', async () => {
    //given
    const token = ''

    //when
    response = await request(server)
      .post('/auth/token')
      .set('authorization', `Bearer ${token}`)
      .send({ token_type: 'refresh_token' })

    //then
    expect(response.statusCode).toBe(401)
  })

  test('Get token and verify with the fake JSON secret', async () => {
    //given
    const token = await JwtTokenCreator(fakeUser)

    //when
    response = await request(server)
      .post('/auth/token')
      .set('authorization', `Bearer ${token}`)
      .send({ token_type: 'refresh_token' })

    //then
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(() => {
      jwt.verify(response.body.token, 'fakeSecret')
    }).toThrow(new JsonWebTokenError('invalid signature'))
  })
})
