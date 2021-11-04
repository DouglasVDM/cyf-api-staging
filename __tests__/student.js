import request from 'supertest'
import { server } from '../src/index'
import JwtTokenCreator from '../src/apps/helpers/jwtTokenCreator'
import UserService from '../src/apps/common/contexts/user'

const appPath = '/application-process'
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
          'student',
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

describe('Student service', () => {
  test('It should not get list of students', async () => {
    response = await request(server).get('/applicant')
    expect(response.statusCode).toBe(401)
  })
  test('It should get student with auth', async () => {
    const token = await JwtTokenCreator(fakeUsers[0])
    response = await request(server)
      .get(`${appPath}/applicant`)
      .set('authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('applicant')
    expect(
      Object.getPrototypeOf(response.body.applicant) === Object.prototype
    ).toBe(true)
    expect(
      Object.keys(response.body.applicant).includes(
        'fullName',
        'steps',
        'category',
        'city',
        'email',
        'experience',
        'interests'
      )
    )
  })
  test('It should fail with bad token', async () => {
    let token = 'RedBullGivesWings'
    response = await request(server)
      .get(`${appPath}/applicant`)
      .set('authorization', token)
    expect(response.statusCode).toBe(401)
  })
})
