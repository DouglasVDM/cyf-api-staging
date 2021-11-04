import request from 'supertest'

import { server } from '../../src'
import createJwtToken from '../../src/apps/helpers/jwtTokenCreator'
import { STUDENT_CATEGORIES } from '../../src/apps/application_process/contexts/students/schema'

beforeAll(() => global.setUp())

afterAll(() => global.tearDown())

describe('/application-process/applicant', () => {
  describe('GET /', () => {
    it('should work with an applicant token', async () => {
      let user = await global.factory.create('user', {}, {})
      const applicant = await global.factory.create(
        'student',
        {},
        {
          category: STUDENT_CATEGORIES.applicant,
          userId: user._id.toJSON()
        }
      )
      await global.factory.create('step', {}, {})

      const token = await createJwtToken(applicant)

      await request(server)
        .get('/application-process/applicant')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
    })
  })
})
