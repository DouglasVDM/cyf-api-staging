import request from 'supertest'
import { server } from '../../src/index'
import UserService from '../../src/apps/common/contexts/user'
import StudentContexts from '../../src/apps/application_process/contexts/students'
import StepContexts from '../../src/apps/application_process/contexts/steps'

const createStepsProgress = async (student, stepId, status) => {
  await global.factory.create(
    'applicant_progress',
    {},
    {
      userId: student.userId,
      stepId: stepId.toJSON(),
      urls: [
        {
          status
        }
      ]
    }
  )
}

beforeAll(async () => {
  await global.setUp()
  await global.factory.createMany('user', 5)
  await global.factory.createMany('step', 4)
  const fakeUsers = await UserService.findAll()
  await Promise.all(
    fakeUsers.map(
      async user =>
        await global.factory.create(
          'student',
          {},
          {
            userId: user._id.toJSON()
          }
        )
    )
  )

  const students = await StudentContexts.findAll()
  const steps = await StepContexts.findAll()
  const step2 = steps.find(step => step.number === 2)
  const step3 = steps.find(step => step.number === 3)
  const step4 = steps.find(step => step.number === 4)

  // student 1
  await createStepsProgress(students[0], step2._id, 'Approved')
  await createStepsProgress(students[0], step3._id, 'Approved')
  await createStepsProgress(students[0], step4._id, 'Approved')

  // student 2
  await createStepsProgress(students[1], step2._id, 'Approved')
  await createStepsProgress(students[1], step3._id, 'Approved')
  await createStepsProgress(students[1], step4._id, 'Submitted')

  // student 3
  await createStepsProgress(students[2], step2._id, 'Approved')
  await createStepsProgress(students[2], step3._id, 'Rejected')
  await createStepsProgress(students[2], step4._id, 'Rejected')

  // student 4
  await createStepsProgress(students[3], step2._id, 'Submitted')
  await createStepsProgress(students[3], step3._id, 'Submitted')

  // student 5
  await createStepsProgress(students[4], step2._id, 'Approved')
  await createStepsProgress(students[4], step3._id, 'Submitted')
})

afterAll(async () => {
  await global.tearDown()
})

describe('/statistics routes', () => {
  describe('GET /statistics/class-status', () => {
    describe('Query students who is ready for interview:', () => {
      test('Query students with step 4 submitted or approved, studentsMatchingCondition should be equal to 2', async () => {
        const response = await request(server)
          .get(
            '/statistics/class-status?stepStatus[]=Approved&stepStatus[]=Submitted&stepNumbers[]=4'
          )
          .expect(200)
        expect(response.body.studentsMatchingCondition).toBe(2)
      })
    })

    describe('Query students with different inputs:', () => {
      test('It should return count of 5 students, when empty query', async () => {
        const response = await request(server)
          .get('/statistics/class-status')
          .expect(200)
        expect(response.body.studentsMatchingCondition).toBe(5)
      })

      test('Query students with step 4, studentsMatchingCondition should be equal to 3', async () => {
        const response = await request(server)
          .get('/statistics/class-status?&stepNumbers[]=4')
          .expect(200)
        expect(response.body.studentsMatchingCondition).toBe(3)
      })

      test('Query students with step 3 approved, studentsMatchingCondition should be equal to 2 ', async () => {
        const response = await request(server)
          .get('/statistics/class-status?stepStatus[]=Approved&stepNumbers[]=3')
          .expect(200)
        expect(response.body.studentsMatchingCondition).toBe(2)
      })
    })

    describe('Negative tests', () => {
      test('if invalid status, should return error', async () => {
        await request(server)
          .get('/statistics/class-status?stepStatus[]=invalid-status')
          .expect(422)
          .expect('Requested status is not valid')
      })

      test('if invalid genders, should return error', async () => {
        await request(server)
          .get('/statistics/class-status?genders[]=invalid-gender')
          .expect(422)
          .expect('Requested gender is not valid')
      })

      test('if invalid stepUpdatedFromDate, should return error', async () => {
        await request(server)
          .get('/statistics/class-status?stepUpdatedFromDate[]=invalid-date')
          .expect(422)
          .expect('Requested date is not valid')
      })
    })
  })
})
