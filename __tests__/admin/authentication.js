import request from 'supertest'

import { server } from '../../src'
import createJwtToken from '../../src/apps/helpers/jwtTokenCreator'
import {
  createAdmin,
  createStudent,
  createVolunteer,
  createApplication
} from '../testHelpers'

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

describe('/admin', () => {
  describe('DELETE /admin/:id', () => {
    it('should reject unauthenticated', async () => {
      const adminToDelete = await createAdmin()
      await request(server)
        .delete(`/admin/${adminToDelete._id.toJSON()}`)
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        const adminToDelete = await createAdmin()
        await request(server)
          .delete(`/admin/${adminToDelete._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        const adminToDelete = await createAdmin()
        await request(server)
          .delete(`/admin/${adminToDelete._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })

  describe('PUT /admin/roles/:id', () => {
    it('should reject unauthenticated', async () => {
      const adminToChange = await createAdmin()
      await request(server)
        .put(`/admin/roles/${adminToChange._id.toJSON()}`)
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        const adminToChange = await createAdmin()
        await request(server)
          .put(`/admin/roles/${adminToChange._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        const adminToChange = await createAdmin()
        await request(server)
          .put(`/admin/roles/${adminToChange._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})
describe('/apps', () => {
  describe('DELETE /apps/:appId', () => {
    it('should reject unauthenticated', async () => {
      const appsToDelete = await createApplication()
      await request(server)
        .delete(`/apps/${appsToDelete._id.toJSON()}`)
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        const appsToDelete = await createApplication()
        await request(server)
          .delete(`/apps/${appsToDelete._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        const appsToDelete = await createApplication()
        await request(server)
          .delete(`/apps/${appsToDelete._id.toJSON()}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204)
      })
    })
  })
})

describe('/migrations/admins', () => {
  describe('GET /migrations/admins', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/migrations/admins')
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/admins')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/admins')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})

describe('/migrations/cities', () => {
  describe('GET /migrations/cities', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/migrations/cities')
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/cities')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/cities')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})

describe('/migrations/delete-duplicate-progress', () => {
  describe('GET /migrations/delete-duplicate-progress', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/migrations/delete-duplicate-progress')
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/delete-duplicate-progress')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/delete-duplicate-progress')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})

describe('/migrations/delete-duplicate-users', () => {
  describe('GET /migrations/delete-duplicate-users', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/migrations/delete-duplicate-users')
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/delete-duplicate-users')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/delete-duplicate-users')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})

describe('/migrations/applicants-to-spreadsheet', () => {
  describe('GET /migrations/applicants-to-spreadsheet', () => {
    it('should reject unauthenticated', async () => {
      await request(server)
        .get('/migrations/applicants-to-spreadsheet')
        .expect(401)
    })
    ;['student', 'volunteer', 'verifiedAdmin'].forEach(userType => {
      it(`should reject ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/applicants-to-spreadsheet')
          .set('Authorization', `Bearer ${token}`)
          .expect(403)
      })
    })
    ;['superAdmin'].forEach(userType => {
      it(`should accept ${userType}`, async () => {
        const token = await createJwtToken(users[userType])
        await request(server)
          .get('/migrations/applicants-to-spreadsheet')
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
      })
    })
  })
})
