import request from 'supertest'
import userService from '../src/apps/common/contexts/user'
import { server } from '../src/index'

let response

beforeAll(async () => {
  await global.setUp()
  await global.factory.createMany('user', 5)
})

afterAll(async () => {
  await global.tearDown()
})

describe('Test the root path', () => {
  beforeEach(async () => {})
  afterEach(() => {
    response = null
  })

  test('GET new user', async () => {
    const users = await userService.findAll()
    expect(users.length).toEqual(5)
  })
  test('It should GET root', async () => {
    response = await request(server).get('/')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({})
  })
})
