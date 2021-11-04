import request from 'supertest'
import volunteerService from '../src/apps/volunteer/contexts/volunteer'
import UserService from '../src/apps/common/contexts/user'
import JwtTokenCreator from '../src/apps/helpers/jwtTokenCreator'
import { server } from '../src/index'
import { createAdmin } from './testHelpers'

let response
let fakeUsers

beforeAll(async () => {
  await global.setUp()
  await global.factory.createMany('user', 5)
  fakeUsers = await UserService.findAll()
  await Promise.all(
    fakeUsers.map(
      async user =>
        await global.factory.create(
          'volunteer',
          {},
          {
            userId: user._id.toJSON()
          }
        )
    )
  )
})

afterAll(async () => {
  await global.tearDown()
})

describe('Volunteers Service', () => {
  test('It should GET list of Volunteers', async () => {
    const admin = await createAdmin()
    const token = await JwtTokenCreator(admin)
    response = await request(server)
      .get('/volunteer?cyfCityIds[]=cityId')
      .set('authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('volunteers')
    expect(Array.isArray(response.body.volunteers)).toBe(true)
    expect(response.body.volunteers.length).toEqual(5)
    const volunteers = await volunteerService.findAll()
    expect(volunteers.length).toEqual(5)
    volunteers.forEach(volunteer => {
      expect(
        Object.keys(volunteer).includes(
          'firstName',
          'city',
          'email',
          'interests'
        )
      )
    })
  })
})
