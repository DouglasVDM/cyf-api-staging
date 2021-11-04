import request from 'supertest'
import { server } from '../../src'
import createJwtToken from '../../src/apps/helpers/jwtTokenCreator'
import { createAdmin, createStudent, createVolunteer } from '../testHelpers'
import { ADMIN_STATUS } from '../../src/apps/common/contexts/user/schema'
import { STUDENT_CATEGORIES } from '../../src/apps/application_process/contexts/students/schema'

const users = {}

beforeAll(async () => {
  await global.setUp()

  users.verifiedAdmin = await createAdmin()
  users.pendingAdmin = await createAdmin({ adminStatus: ADMIN_STATUS.pending })
  users.suspendedAdmin = await createAdmin({
    adminStatus: ADMIN_STATUS.suspended
  })
  users.superAdmin = await createAdmin({ superAdmin: true })

  users.student = await createStudent()
  users.alumni = await createStudent({ category: STUDENT_CATEGORIES.alumni })
  users.applicant = await createStudent({
    category: STUDENT_CATEGORIES.applicant
  })

  users.volunteer = await createVolunteer()
})

afterAll(async () => {
  await global.tearDown()
})

describe('/events', () => {
  describe('GET /user/:id', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/events/user/IRRELEVANT')
        .send({ user: users.verifiedAdmin })
        .expect(401)
    })
    ;[
      'alumni',
      'applicant',
      'pendingAdmin',
      'student',
      'suspendedAdmin',
      'volunteer'
    ].forEach(name => {
      it(`should reject ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/events/user/IRRELEVANT')
          .set('Authorization', `Bearer ${token}`)
          .send({ user: users.verifiedAdmin })
          .expect(401)
      })
    })
    ;['superAdmin', 'verifiedAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/events/user/IRRELEVANT')
          .set('Authorization', `Bearer ${token}`)
          .send({ user: users.verifiedAdmin })
          .expect(200)
      })
    })
  })
})
