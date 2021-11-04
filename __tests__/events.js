import eventsService from '../src/apps/events/contexts/events'
import request from 'supertest'
import { server } from '../src/index'

let response

beforeAll(async () => {
  await global.setUp()
  await global.factory.createMany('event', 5)
})

afterAll(async () => {
  await global.tearDown()
})

describe('Events service', () => {
  test('It should GET events', async () => {
    response = await request(server).get('/events')
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('events')
    expect(Array.isArray(response.body.events)).toBe(true)
    expect(response.body.events.length).toEqual(5)
    const events = await eventsService.findAll()
    expect(events.length).toEqual(5)
    events.forEach(event => {
      expect(
        Object.keys(event).includes(
          'name',
          'description',
          'occurAt',
          'finishAt',
          'address',
          'cityId'
        )
      )
    })
  })
})
