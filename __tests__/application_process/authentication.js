import request from 'supertest'

import { server } from '../../src'
import { STUDENT_CATEGORIES } from '../../src/apps/application_process/contexts/students/schema'
import { ADMIN_STATUS } from '../../src/apps/common/contexts/user/schema'
import createJwtToken from '../../src/apps/helpers/jwtTokenCreator'
import { createAdmin, createStudent, createVolunteer } from '../testHelpers'

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

describe('/application-process', () => {
  describe('GET /admin', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/application-process/admin')
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
          .get('/application-process/admin')
          .set('Authorization', `Bearer ${token}`)
          .send({ user: users.verifiedAdmin })
          .expect(401)
      })
    })
    ;['superAdmin', 'verifiedAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/application-process/admin')
          .set('Authorization', `Bearer ${token}`)
          .send({ user: users.verifiedAdmin })
          .expect(200)
      })
    })
  })

  describe('GET /admins', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/application-process/admins')
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(name => {
      it(`should reject ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/application-process/admins')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/application-process/admins')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })

  describe('GET /applicants', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/application-process/applicants')
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
          .get('/application-process/applicants')
          .set('Authorization', `Bearer ${token}`)
          .expect(401)
      })
    })
    ;['superAdmin', 'verifiedAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/application-process/applicants')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })

  describe('GET /applicant/:id', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get(`/application-process/applicant/${users.student._id.toJSON()}`)
        .expect(401)
    })
    ;['student', 'volunteer'].forEach(name => {
      it(`should reject ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get(`/application-process/applicant/${users.student._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(401)
      })
    })
    ;['superAdmin', 'verifiedAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get(`/application-process/applicant/${users.student._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })

  describe('GET /applicant', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/application-process/applicant')
        .expect(400) // TODO: should be protected by JWT -> 401
    })
    ;['student', 'superAdmin', 'verifiedAdmin', 'volunteer'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .get('/application-process/applicant')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })

  describe('PUT /user', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .put('/application-process/user')
        .send({ _id: users.verifiedAdmin._id, adminData: {} })
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
          .put('/application-process/user')
          .set('Authorization', `Bearer ${token}`)
          .send({ _id: users.verifiedAdmin._id, adminData: {} })
          .expect(401)
      })
    })
    ;['superAdmin', 'verifiedAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .put('/application-process/user')
          .set('Authorization', `Bearer ${token}`)
          .send({ _id: users.verifiedAdmin._id, adminData: {} })
          .expect(200)
      })
    })
  })

  describe('DELETE /applicant/:userId?', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .delete(
          `/application-process/applicant/${users.applicant._id.toJSON()}`
        )
        .expect(401)
    })
    ;['student', 'verifiedAdmin', 'volunteer'].forEach(name => {
      it(`should reject ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .delete(
            `/application-process/applicant/${users.applicant._id.toJSON()}`
          )
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(name => {
      it(`should accept ${name}`, async () => {
        const token = await createJwtToken(users[name])
        await request(server)
          .delete(
            `/application-process/applicant/${users.applicant._id.toJSON()}`
          )
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})

describe('PUT /application-process/applicant/:userId', () => {
  it('should reject unauthenticated', async () => {
    const applicantUpdate = await createStudent({
      category: STUDENT_CATEGORIES.applicant
    })
    await request(server)
      .put(`/application-process/applicant/${applicantUpdate._id.toJSON()}`)
      .expect(401)
  })
  ;['student', 'volunteer'].forEach(name => {
    it(`should reject ${name}`, async () => {
      const token = await createJwtToken(users[name])
      const applicantUpdate = await createStudent({
        category: STUDENT_CATEGORIES.applicant
      })
      await request(server)
        .put(`/application-process/applicant/${applicantUpdate._id.toJSON()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
    })
  })
  ;['superAdmin', 'verifiedAdmin'].forEach(name => {
    it(`should accept ${name}`, async () => {
      const token = await createJwtToken(users[name])
      const applicantUpdate = await createStudent({
        category: STUDENT_CATEGORIES.applicant
      })
      await request(server)
        .put(`/application-process/applicant/${applicantUpdate._id.toJSON()}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })
})
