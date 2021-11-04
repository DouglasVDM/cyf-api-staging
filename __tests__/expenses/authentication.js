import request from 'supertest'

import { server } from '../../src'
import createJwtToken from '../../src/apps/helpers/jwtTokenCreator'
import { createAdmin, createStudent, createVolunteer } from '../testHelpers'

const users = {}

beforeAll(async () => {
  await global.setUp()

  users.verifiedAdmin = await createAdmin()
  users.superAdmin = await createAdmin({ superAdmin: true })

  users.student = await createStudent()
  users.volunteer = await createVolunteer()
})

afterAll(async () => {
  await global.tearDown()
})

describe('/students', () => {
  describe('GET /expenses', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/students/expenses')
        .expect(401)
    })
    ;['student', 'volunteer'].forEach(profile => {
      it(`should reject ${profile}`, async () => {
        const token = await createJwtToken(users[profile])
        await request(server)
          .get('/students/expenses')
          .set('Authorization', `Bearer ${token}`)
          .expect(401)
      })
    })
    ;['verifiedAdmin', 'superAdmin'].forEach(profile => {
      it(`should accept ${profile}`, async () => {
        const token = await createJwtToken(users[profile])
        await request(server)
          .get('/students/expenses')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})
