import request from 'supertest'
import { promisify } from 'util'

import { server } from '../../src'
import { validOriginFor } from '../../src/helpers'

beforeAll(() => global.setUp())

afterAll(() => global.tearDown())

beforeEach(() => {
  global.console.error = () => {}
})

const PRODUCTION_ORIGINS = [
  'https://codeyourfuture.io',
  'https://application-process.codeyourfuture.io',
  'https://dashboard.codeyourfuture.io',
  'https://events.codeyourfuture.io',
  'https://forms.codeyourfuture.io',
  'https://students.codeyourfuture.io',
  'https://course1.codeyourfuture.io',
  'https://some-new.codeyourfuture.io'
]

const STAGING_ORIGINS = [
  'https://application-process.staging.codeyourfuture.io',
  'https://dashboard.staging.codeyourfuture.io',
  'https://events.staging.codeyourfuture.io',
  'https://staging.forms.codeyourfuture.io',
  'https://students.staging.codeyourfuture.io',
  'https://some-new.staging.codeyourfuture.io'
]

it('sets the cross-origin headers for CYF URLs', async () => {
  const url = PRODUCTION_ORIGINS[0]
  await request(server)
    .options('/cities')
    .set('Origin', url)
    .expect('access-control-allow-origin', url)
})

it('does not set the cross-origin headers for non-CYF URLs', async () => {
  const url = 'https://google.com'
  await request(server)
    .options('/cities')
    .set('Origin', url)
    .then(res => {
      expect(res.headers['access-control-allow-origin']).toBeUndefined()
    })
})

describe('isValidOrigin', () => {
  describe('PRODUCTION', () => {
    const env = 'PRODUCTION'

    PRODUCTION_ORIGINS.forEach(origin => {
      it(`allows ${origin}`, () => {
        return expect(promisify(validOriginFor(env))(origin)).resolves.toBe(
          true
        )
      })
    })
    ;[
      ...STAGING_ORIGINS,
      'https://.codeyourfuture.io',
      'http://localhost:3000',
      'https://google.com'
    ].forEach(origin => {
      it(`does not allow ${origin}`, () => {
        return expect(promisify(validOriginFor(env))(origin)).resolves.toBe(
          false
        )
      })
    })
  })

  describe('STAGING', () => {
    const env = 'STAGING'

    STAGING_ORIGINS.forEach(origin => {
      it(`allows ${origin}`, () => {
        return expect(promisify(validOriginFor(env))(origin)).resolves.toBe(
          true
        )
      })
    })
    ;[
      ...PRODUCTION_ORIGINS,
      'https://.codeyourfuture.io',
      'http://localhost:3000',
      'https://google.com'
    ].forEach(origin => {
      it(`does not allow ${origin}`, () => {
        return expect(promisify(validOriginFor(env))(origin)).resolves.toBe(
          false
        )
      })
    })
  })

  describe('DEVELOPMENT', () => {
    const env = 'DEVELOPMENT'

    ;['http://localhost:3000'].forEach(origin => {
      it(`allows ${origin}`, () => {
        return expect(promisify(validOriginFor(env))(origin)).resolves.toBe(
          true
        )
      })
    })
    ;[
      ...PRODUCTION_ORIGINS,
      ...STAGING_ORIGINS,
      'https://google.com',
      'https://.codeyourfuture.io'
    ].forEach(origin => {
      it(`does not allow ${origin}`, () => {
        return expect(promisify(validOriginFor(env))(origin)).resolves.toBe(
          false
        )
      })
    })
  })
})
