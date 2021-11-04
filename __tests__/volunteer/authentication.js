import request from 'supertest'

import { server } from '../../src'
import createJwtToken from '../../src/apps/helpers/jwtTokenCreator'
import { createAdmin, createStudent, createVolunteer } from '../testHelpers'
import { ADMIN_STATUS } from '../../src/apps/common/contexts/user/schema'

const users = {}
let volunteerToUpdate

beforeAll(async () => {
  await global.setUp()

  users.superAdmin = await createAdmin({ superAdmin: true })
  users.verifiedAdmin = await createAdmin()

  users.pendingAdmin = await createAdmin({
    adminStatus: ADMIN_STATUS.pending
  })
  users.suspendedAdmin = await createAdmin({
    adminStatus: ADMIN_STATUS.suspended
  })

  users.student = await createStudent()
  users.volunteer = await createVolunteer()
})

afterAll(async () => {
  await global.tearDown()
})

beforeEach(async () => {
  volunteerToUpdate = await createVolunteer()
})

describe('/volunteer', () => {
  describe('GET /', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/volunteer')
        .expect(401)
    })
    ;['student', 'volunteer'].forEach(profile => {
      it(`should reject ${profile}`, async () => {
        const token = await createJwtToken(users[profile])
        await request(server)
          .get('/volunteer')
          .set('Authorization', `Bearer ${token}`)
          .expect(401)
      })
    })
    ;['verifiedAdmin', 'superAdmin'].forEach(profile => {
      it(`should accept ${profile}`, async () => {
        const token = await createJwtToken(users[profile])
        await request(server)
          .get('/volunteer')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })

  describe('PUT /volunteer/:userId', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .put(`/volunteer/${volunteerToUpdate._id.toJSON()}`)
        .send({
          volunteerData: {
            volunteerStatus: 'ACTIVE'
          }
        })
        .expect(401)
    })
    ;['student', 'volunteer', 'suspendedAdmin', 'pendingAdmin'].forEach(
      profile => {
        it(`should reject ${profile}`, async () => {
          const token = await createJwtToken(users[profile])
          await request(server)
            .put(`/volunteer/${volunteerToUpdate._id.toJSON()}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
              volunteerData: { volunteerStatus: 'ACTIVE' }
            })
            .expect(401)
        })
      }
    )
    ;['verifiedAdmin', 'superAdmin'].forEach(profile => {
      it(`should accept ${profile}`, async () => {
        const token = await createJwtToken(users[profile])
        await request(server)
          .put(`/volunteer/${volunteerToUpdate._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            volunteerData: { volunteerStatus: 'ACTIVE' }
          })
          .expect(200)
      })
    })
  })
})
