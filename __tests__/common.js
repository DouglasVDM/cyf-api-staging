import citiesService from '../src/apps/common/contexts/cities'
import request from 'supertest'
import { server } from '../src/index'
import UserService from '../src/apps/common/contexts/user'
import JwtTokenCreator from '../src/apps/helpers/jwtTokenCreator'

let fakeUsers
let fakeUser

beforeAll(async () => {
  await global.setUp()
  await global.factory.createMany('cities', 5)
  await global.factory.createMany('user', 1)
  fakeUsers = await UserService.findAll()
  fakeUser = fakeUsers[0]
})

afterAll(async () => {
  await global.tearDown()
})

describe('Test the common stuff', () => {
  test('It should GET cities', async () => {
    const token = await JwtTokenCreator(fakeUser)
    const response = await request(server)
      .get('/cities')
      .set('authorization', `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('cities')
    expect(response.body.cities.length).toEqual(5)

    const cities = await citiesService.findAll()
    expect(cities.length).toEqual(5)
  })
})
